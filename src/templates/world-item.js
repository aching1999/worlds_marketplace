import React from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import MiddleEllipsis from "react-middle-ellipsis";
import { navigate } from "gatsby";
import { useBreakpoint } from "gatsby-plugin-breakpoints";
import Metadata from "../components/Metadata";
import styled from "styled-components";
import {
  ShareModal,
  TradeModal,
  SuccessTransactionToast,
  PendingTransactionToast,
  tradeErrorHandler,
} from "../components/Modal";
import { Share2 } from "@geist-ui/react-icons";
import { Box, Text } from "@chakra-ui/layout";
import {
  Link,
  Tooltip,
  Button,
  ButtonGroup,
  IconButton,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { SmallCloseIcon, RepeatIcon } from "@chakra-ui/icons";
import { useStoreState } from "easy-peasy";
import Market from "../cardano/market";
import secrets from "../../secrets";
import { UnitDisplay } from "../components/UnitDisplay";
import Loader from "../cardano/loader";
import Show from "../images/assets/show.svg";

export const toHex = (bytes) => Buffer.from(bytes).toString("hex");
const isBrowser = () => typeof window !== "undefined";

const World = (props) => {
   /* old vars here ================================================================================ */
  const spacebud = props.spacebud; 
  const matches = useBreakpoint();
  const toast = useToast();
  const [owner, setOwner] = React.useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const tradeRef = React.useRef();
  const vrSrcRef = React.useRef();
  const [isLoadingMarket, setIsLoadingMarket] = React.useState(true);
  const [isLoadingVR, setIsLoadingVR] = React.useState(false);
  const [details, setDetails] = React.useState({
    bid: { bidUtxo: null, lovelace: null, usd: null, owner: false },
    offer: { offerUtxo: null, lovelace: null, usd: null, owner: true },
    lastSale: { lovelace: null, usd: null },
  });
  const [loadingButton, setLoadingButton] = React.useState({
    cancelBid: false,
    bid: false,
    buy: false,
    offer: false,
    cancelOffer: false,
    sell: false,
  });
  const connected = useStoreState((state) => state.connection.connected);

  const market = React.useRef();

  const POLICY = "3c2cfd4f1ad33678039cfd0347cca8df363c710067d739624218abc0"; // mainnet
  const CONTRACT_ADDRESS =
    // "addr1wyvvtqlx34nu8xkpe86dcznlj9kwgpy97x0zpgqnr782hvcyjjcdh";
    "addr1zyvvtqlx34nu8xkpe86dcznlj9kwgpy97x0zpgqnr782hvlassd377xwhjrwyuqtxsces0ksaev6s7pllvd7hrpfn98q35a5tz"; // This is the staked version of the address above.

  const connectedAddresses = React.useRef([]);

  const isOwner = (address) =>
    connectedAddresses.current.length > 0
      ? connectedAddresses.current.some((addr) => addr === address)
      : false;

  const firstUpdate = React.useRef(true);
  const init = async () => {
    connectedAddresses.current = connected
      ? (await window.cardano.selectedWallet.getUsedAddresses()).map((addr) =>
          Loader.Cardano.Address.from_bytes(
            Buffer.from(addr, "hex")
          ).to_bech32()
        )
      : [];
    if (firstUpdate.current) {
      await loadMarket();
      await loadSpaceBudData();
      firstUpdate.current = false;
      return;
    }
    await loadSpaceBudData();
  };
  
  const checkTransaction = async (txHash, { type, lovelace } = {}) => { // TODO - Where is this used, can we remove it?
    if (!txHash) return;
    PendingTransactionToast(toast);
    if (type) {
      fetch("https://api.spacebudzbot.com/tweet", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + secrets.TWITTER_BOT_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: spacebud.id.toString(), type, lovelace }),
      })
        .then(console.log)
        .catch(console.log);
    }
    await market.current.awaitConfirmation(txHash);
    toast.closeAll();
    SuccessTransactionToast(toast, txHash);
    await new Promise((res, rej) => setTimeout(() => res(), 1000));
    loadSpaceBudData();
  };

  const loadMarket = async () => {
    market.current = new Market(
      {
        base: "https://cardano-mainnet.blockfrost.io/api/v0",
        projectId: secrets.PROJECT_ID,
      },
      ""
    );
    await market.current.load(); // TODO - Do we need to fix load at all?
  };

  const loadSpaceBudData = async () => { // TODO - We can load the worlds within here based purely on ID I think.
    await Loader.load();
    setIsLoadingMarket(true);
    setOwner([]);
    const sid = (spacebud.id).padStart(5, "0")
    console.log(sid)
    const token = POLICY + toHex(`WorldsWithin${sid}`);
    console.log("between sid and token")
    console.log(token)
    let addresses = await fetch(
      `https://cardano-mainnet.blockfrost.io/api/v0/assets/${token}/addresses`,
      { headers: { project_id: secrets.PROJECT_ID } }
    ).then((res) => res.json());
    const fiatPrice = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd`
    )
      .then((res) => res.json())
      .then((res) => res.cardano["usd"]);
    const lastSale = null // {"budId":spacebud.id,"offer":null,"bid":null,"lastSale":null}
    /*await fetch( // TODO - Remove or replace. - Where are these being published from?
      `https://spacebudz.io/api/specificSpaceBud/${spacebud.id}`
    )
      .then((res) => res.json())
      .then((res) => res.lastSale);*/

    const bidUtxo = await market.current.getBid(spacebud.id);
    let offerUtxo = await market.current.getOffer(spacebud.id);

    // check if twin
    /*if (Array.isArray(offerUtxo)) {
      if (
        offerUtxo.length === 2 &&
        (spacebud.id === 1903 || spacebud.id === 6413)
      ) {
        const ownerUtxo = offerUtxo.find((utxo) =>
          isOwner(utxo.tradeOwnerAddress.to_bech32())
        );

        if (ownerUtxo) {
          offerUtxo = ownerUtxo;
        } else {
          const offerUtxo1 = offerUtxo[0];
          const offerUtxo2 = offerUtxo[1];
          // set correct owner
          addresses = [
            { adddress: offerUtxo1.tradeOwnerAddress.to_bech32() },
            { address: offerUtxo1.tradeOwnerAddress.to_bech32() },
          ];
          if (
            isBrowser() &&
            window.BigInt(offerUtxo1.lovelace) <
              window.BigInt(offerUtxo2.lovelace)
          ) {
            offerUtxo = offerUtxo1;
          } else {
            offerUtxo = offerUtxo2;
          }
        }
      } else throw new Error("Something went wrong");
    }*/
    const details = {
      bid: { bidUtxo: null, lovelace: null, usd: null, owner: false },
      offer: { offerUtxo: null, lovelace: null, usd: null, owner: false },
      lastSale: { lovelace: null, usd: null },
    };
    details.bid.bidUtxo = bidUtxo;
    details.offer.offerUtxo = offerUtxo;
    console.log(bidUtxo);
    console.log(offerUtxo);
    // ignore if state is StartBid
    if (toHex(bidUtxo.datum.to_bytes()) !== "d866820080") {
      if (isOwner(bidUtxo.tradeOwnerAddress.to_bech32())) {
        details.bid.owner = true;
      }
      details.bid.lovelace = bidUtxo.lovelace;
      details.bid.usd = (bidUtxo.lovelace / 10 ** 6) * fiatPrice * 10 ** 2;
    }
    console.log(addresses)
    // console.log(address)
    if (addresses.find((address) => isOwner(address.address)))
      details.offer.owner = true;
    if (offerUtxo) {
      addresses = addresses.map((address) =>
        address.address === CONTRACT_ADDRESS
          ? { address: offerUtxo.tradeOwnerAddress.to_bech32() }
          : address
      );
      if (isOwner(offerUtxo.tradeOwnerAddress.to_bech32())) {
        details.offer.owner = true;
      }
      details.offer.lovelace = offerUtxo.lovelace;
      details.offer.usd = (offerUtxo.lovelace / 10 ** 6) * fiatPrice * 10 ** 2;
    }

    if (lastSale) {
      details.lastSale.lovelace = lastSale;
      details.lastSale.usd = (lastSale / 10 ** 6) * fiatPrice * 10 ** 2;
    }

    //check if same address if there are 2

    if (addresses.length > 1 && addresses[0].address === addresses[1].address) {
      addresses = [addresses[0]];
    }

    setDetails(details);
    setOwner(addresses);
    setIsLoadingMarket(false);
  };
  
   /* end old vars ================================================================================= */
   
   React.useEffect(() => { 
	const script = document.createElement("script");
	script.src = process.env.SITE_ROOT+"js/app.js";
	script.async = true;
	document.body.appendChild(script);
	init();
  }, [connected]);
   
   return (
    <div>
		{/* Modal */}
          <ShareModal
            bud={spacebud}
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
          />
          <TradeModal
            budId={spacebud.id}
            ref={tradeRef}
            market={market.current}
            details={details}
            onConfirm={checkTransaction}
          />
        {/* Modal End */}
		{/* Body */}
		<div className="outer__inner">
			<div className="section item">
			  <div className="item__center center">
				<div className="item__bg">
				  <div className={"item__preview" + (isLoadingVR ? " vr-height" : "")}>
					<div className="item__categories">
					  <div className="status-black item__category">{spacebud.world_type}</div>
					  <div className="status-purple item__category">{spacebud.terrain_trait}</div>
					</div>
					{isLoadingVR ? (
					  <>				 
						<div className="vr_loader" id={"vr_loader"}>
							<img src={process.env.SITE_ROOT+"img/loader.gif"} alt="Loader"/>
						</div>
						<iframe id={"iframe_vr"} ref={vrSrcRef} src={spacebud.src.replace("ipfs://", "https://ipfs.io/ipfs/")} className="iframe_vr" height="100%" width="100%" style={{border: 'none'}}></iframe>
					  </>	
					 ) : (
					  <img srcSet={spacebud.image} src={spacebud.image} alt="Item" />
					 )
					}
				  </div>
				  {!isLoadingVR && (
					  <div className="options">
						<div className="options__list">
						  <Button
							onClick={() => {
							  setIsLoadingVR(true);
							}}
							bgcolor="#263238"
							rounded="3xl"
							colorScheme="gray"
							width="min"
						  >
							Load Virtual World
						  </Button>		  
						</div>					
					  </div>
				    ) 
				  }
				</div>
				<div className="item__details">
				  <h1 className="item__title h3">WorldsWithin #{spacebud.id}</h1>
				  {isLoadingMarket ? (
						<div className="item__cost">
							<img src={process.env.SITE_ROOT+"img/loader.gif"} alt="Loader" style={{maxWidth: '100px'}}/>
						</div>	  
				   ) : (
				   	<>
						<div className="item__cost">
							<div className="status-stroke-green item__price">
								<UnitDisplay
									  showQuantity={!Boolean(details.lastSale.lovelace)}
									  fontSize={16}
									  color="#45B26B"
									  quantity={details.lastSale.lovelace || 0}
									  symbol="ADA"
									  decimals={6}
									/>
							</div>
							<div className="status-stroke-black item__price">
								<UnitDisplay
									  showQuantity={!Boolean(details.lastSale.usd)}
									  fontSize={16}
									  color="#777E90"
									  quantity={details.lastSale.usd || 0}
									  symbol="USD"
									  decimals={2}
									/>
							</div>
							<div className="item__counter">Last Sale</div>
						</div>
						{details.offer.owner ? (
						  <>
							<div className="item__cost">
								<div className="status-stroke-green item__price">
									<UnitDisplay
									  showQuantity={!Boolean(details.bid.lovelace)}
									  fontSize={16}
									  color="#45B26B"
									  quantity={details.bid.lovelace || 0}
									  symbol="ADA"
									  decimals={6}
									/>
								</div>
								<div className="status-stroke-black item__price">
									<UnitDisplay
									  showQuantity={!Boolean(details.bid.usd)}
									  fontSize={16}
									  color="#777E90"
									  quantity={details.bid.usd || 0}
									  symbol="USD"
									  decimals={2}
									/>
								</div>
								<div className="item__counter">Sell Now Price</div>
							</div>
							<div className="itemcontrol_group">
								{details.bid.owner ? (
									<Tooltip label="Cancel Bid" rounded="3xl">
										<Button
										  isDisabled={loadingButton.cancelBid}
										  isLoading={loadingButton.cancelBid}
										  onClick={async () => {
											if (!connected) return;
											setLoadingButton((l) => ({
											  ...l,
											  cancelBid: true,
											}));
											const txHash = await market.current
											  .cancelBid(details.bid.bidUtxo)
											  .catch((e) => tradeErrorHandler(e, toast));
											setLoadingButton((l) => ({
											  ...l,
											  cancelBid: false,
											}));
											checkTransaction(txHash);
										  }}
										  rounded="3xl"
										  size="md"
										  color="white"
										  bgColor="red.300"
										  colorScheme="red">
										  Cancel Bid
										</Button>
									</Tooltip>			  
								 ) : (
									<Tooltip label={
										  details.offer.offerUtxo &&
										  isOwner(
											details.offer.offerUtxo.tradeOwnerAddress.to_bech32()
										  ) &&
										  "Cancel Offer first"
										} rounded="3xl">
										<Button
										  isDisabled={
											!Boolean(details.bid.lovelace) || loadingButton.sell
										  }
										  isLoading={loadingButton.sell}
										  rounded="3xl"
										  size="md"
										  colorScheme="purple"
										  width="min"
										  bgcolor="#263238"
										  rounded="3xl"
										  width="min"
										  onClick={async () => {
											if (
											  !connected ||
											  (details.offer.offerUtxo &&
												isOwner(
												  details.offer.offerUtxo.tradeOwnerAddress.to_bech32()
												))
											)
											  return;
											setLoadingButton((l) => ({
											  ...l,
											  sell: true,
											}));
											const txHash = await market.current
											  .sell(details.bid.bidUtxo)
											  .catch((e) => tradeErrorHandler(e, toast));
											setLoadingButton((l) => ({
											  ...l,
											  sell: false,
											}));
											checkTransaction(txHash, {
											  type: "sold",
											  lovelace: details.bid.lovelace,
											});
										  }}>
										  Sell
										</Button>
									</Tooltip>
								 )
								}
								{ details.offer.lovelace &&
								  details.offer.offerUtxo &&
								  isOwner(
									details.offer.offerUtxo.tradeOwnerAddress.to_bech32()
								  ) ? (								
									<Tooltip label="Cancel Offer" rounded="3xl">
									  <Button
										isDisabled={loadingButton.cancelOffer}
										isLoading={loadingButton.cancelOffer}
										onClick={async () => {
										  if (!connected) return;
										  setLoadingButton((l) => ({
											...l,
											cancelOffer: true,
										  }));
										  const txHash = await market.current
											.cancelOffer(details.offer.offerUtxo)
											.catch((e) => tradeErrorHandler(e, toast));
										  setLoadingButton((l) => ({
											...l,
											cancelOffer: false,
										  }));
										  checkTransaction(txHash);
										}}
										color="white"
										bgColor="red.300"
										colorScheme="red"
										rounded="3xl"
										aria-label="Add to friends"
										icon={<SmallCloseIcon />}
									  >
										Cancel Offer
									  </Button>
									</Tooltip>
								  ) : (								
									<Button
									  variant="outline"
									  rounded="3xl"
									  colorScheme="gray"
									  onClick={() => {
										if (!connected) return;
										tradeRef.current.openModal({
										  minPrice: "20000000",
										  type: "OFFER",
										});
									  }}
									>
									  List
									</Button>
								  )
								}
								<div className="item__cost">
									<div className="status-stroke-green item__price">
										<UnitDisplay
										  showQuantity={!Boolean(details.offer.lovelace)}
										  fontSize={16}
										  color="#45B26B"
										  quantity={details.offer.lovelace || 0}
										  symbol="ADA"
										  decimals={6}
										/>
									</div>
									<div className="status-stroke-black item__price">
										<UnitDisplay
										  showQuantity={!Boolean(details.offer.usd)}
										  fontSize={16}
										  color="#777E90"
										  quantity={details.offer.usd || 0}
										  symbol="USD"
										  decimals={2}
										/>									
									</div>
									<div className="item__counter">Ask price</div>
								</div>
							</div>
						  </>
						 ) : (
						  <>
						   <div className="itemcontrol_group">
							<div className="item__cost">
								<div className="status-stroke-green item__price">
									<UnitDisplay
									  showQuantity={!Boolean(details.offer.lovelace)}
									  fontSize={16}
									  color="#45B26B"
									  quantity={details.offer.lovelace || 0}
									  symbol="ADA"
									  decimals={6}
									/>
								</div>
								<div className="status-stroke-black item__price">
									<UnitDisplay
									  showQuantity={!Boolean(details.offer.usd)}
									  fontSize={16}
									  color="#777E90"
									  quantity={details.offer.usd || 0}
									  symbol="USD"
									  decimals={2}
									/>
								</div>
								<div className="item__counter">Purchase Price</div>
							</div>							
							<Tooltip 
							  label={
								(!connected && "Connect wallet") ||
								(details.bid.owner &&
								  details.bid.lovelace &&
								  "Cancel Bid first")
							  }
							  rounded="3xl"
							>
							  <Button
								isDisabled={
								  !Boolean(details.offer.lovelace) || loadingButton.buy
								}
								isLoading={loadingButton.buy}
								onClick={async () => {
								  if (!connected || details.bid.owner) return;
								  setLoadingButton((l) => ({
									...l,
									buy: true,
								  }));
								  const txHash = await market.current
									.buy(details.offer.offerUtxo)
									.catch((e) => tradeErrorHandler(e, toast));
								  setLoadingButton((l) => ({
									...l,
									buy: false,
								  }));
								  checkTransaction(txHash, {
									type: "bought",
									lovelace: details.offer.lovelace,
								  });
								}}
								rounded="3xl"
								size="md"
								className="blue-button"
								colorScheme="blue"
								width="min"
							  >
								Purchase now
							  </Button>
							</Tooltip>
						   </div>
						   <div className="itemcontrol_group">
							<div className="item__cost">
								<div className="status-stroke-green item__price">
									<UnitDisplay
									  showQuantity={!Boolean(details.bid.lovelace)}
									  fontSize={16}
									  color="#45B26B"
									  quantity={details.bid.lovelace || 0}
									  symbol="ADA"
									  decimals={6}
									/>
								</div>
								<div className="status-stroke-black item__price">
									<UnitDisplay
									  showQuantity={!Boolean(details.bid.usd)}
									  fontSize={16}
									  color="#777E90"
									  quantity={details.bid.usd || 0}
									  symbol="USD"
									  decimals={2}
									/>
								</div>
								<div className="item__counter">Bid Price</div>
							</div>
							<ButtonGroup size="md" isAttached variant="outline">
								<Tooltip
								  label={!connected && "Connect wallet"}
								  rounded="3xl"
								>
								  <Button
									onClick={() => {
									  if (!connected) return;
									  tradeRef.current.openModal({
										minPrice: details.bid.lovelace
										  ? (
											  isBrowser() &&
											  window.BigInt(details.bid.lovelace) +
												window.BigInt("10000")
											).toString()
										  : "20000000",
										type: "BID",
									  });
									}}
									bgcolor="#263238"
									rounded="3xl"
									colorScheme="gray"
									width="min"
								  >
									Place a Bid
								  </Button>
								</Tooltip>
								{details.bid.owner && (
								  <Tooltip label="Cancel Bid" rounded="3xl">
									<IconButton
									  isDisabled={loadingButton.cancelBid}
									  isLoading={loadingButton.cancelBid}
									  onClick={async () => {
										if (!connected) return;
										setLoadingButton((l) => ({
										  ...l,
										  cancelBid: true,
										}));
										const txHash = await market.current
										  .cancelBid(details.bid.bidUtxo)
										  .catch((e) => tradeErrorHandler(e, toast));
										setLoadingButton((l) => ({
										  ...l,
										  cancelBid: false,
										}));
										checkTransaction(txHash);
									  }}
									  bgColor="red.300"
									  variant="solid"
									  rounded="3xl"
									  aria-label="Add to friends"
									  icon={<SmallCloseIcon />}
									/>
								  </Tooltip>
								)}
							</ButtonGroup>
						   </div>	
						  </>
						 )
						}
					</>
				   )
				  }
				  <div className="item__control">					
					{/* <div className="item__btns"><a className="button item__button js-popup-open" href="#popup-purchase" data-effect="mfp-zoom-in">Purchase now</a><a className="button-stroke item__button js-popup-open" href="#popup-bid" data-effect="mfp-zoom-in">Place a bid</a></div> */}
					<div className="item__variants">Service fee <span className="item__percent">~ 2.4%</span></div>
				  </div>				  
				  <div className="item__tabs js-tabs">
					<div className="item__nav"><a className="item__link js-tabs-link active" href="#">Info</a><a className="item__link js-tabs-link" href="#">Owners</a>{/* <a className="item__link js-tabs-link" href="#">History</a><a className="item__link js-tabs-link" href="#">Bids</a> */}</div>
					<div className="item__container">
					  <div className="item__box js-tabs-item" style={{display: "block"}}>
						<div className="item__users">
						  <div className="item__user">
							<div className="item__avatar"><img src={process.env.SITE_ROOT+"img/icon-planet.png"} alt="Avatar"/></div>
							<div className="item__description">
							  <div className="item__position">World Type</div>
							  <div className="item__name">{spacebud.world_type}</div>
							</div>
						  </div>
						  <div className="item__user">
							<div className="item__avatar"><img src={process.env.SITE_ROOT+"img/icon-terrain.png"} alt="Avatar"/></div>
							<div className="item__description">
							  <div className="item__position">Terrain Trait &amp; color</div>
							  <div className="item__name">{spacebud.terrain_trait} <span className="terrain_color" style={{backgroundColor: '#'+spacebud.terrain_color}} title={spacebud.terrain_color}>&nbsp;</span></div>
							</div>
						  </div>						  
						  <div className="item__user">
							<div className="item__avatar"><img src={process.env.SITE_ROOT+"img/icon-daylength.png"} alt="Avatar"/></div>
							<div className="item__description">
							  <div className="item__position">Year &amp; Day Length</div>
							  <div className="item__name">{spacebud.year_length} and {spacebud.day_length}</div>
							</div>
						  </div>						  
						  <div className="item__user">
							<div className="item__avatar"><img src={process.env.SITE_ROOT+"img/icon-traits.png"} alt="Avatar"/></div>
							<div className="item__description">
							  <div className="item__position">Traits ({spacebud.gadgets.length})</div>
							  <div className="item__name">{spacebud.gadgets.map((item, i) => (
								   <span className="trait">{item}</span>
							  ))}</div>
							</div>
						  </div>
						</div>
					  </div>
					  <div className="item__box js-tabs-item">
						<div className="item__users">
						  {owner.length > 0 ? (
							 owner.map((item, i) => (				   
								 <div className="item__user owner" key={i}>
									<div className="item__avatar"><img src={process.env.SITE_ROOT+"img/icon-owner.png"} alt="Avatar"/></div>
									<div className="item__description">
									  <div className="item__position">Owner</div>
									  <div className="item__name owner">
									  	<MiddleEllipsis>
											<Link underline color="purple.600" 
											    className="owner"
												onClick={(e) => {
												  if (owner) navigate(`${process.env.SITE_ROOT}profile?address=${item.address}`);
												}}>
												{item.address}
											</Link>
										</MiddleEllipsis>
									  </div>
									</div>
								 </div>
							 ))
						   ) : (
							  <img src={process.env.SITE_ROOT+"img/loader.gif"} alt="Loader" style={{maxWidth: '100px'}}/>			   
						   )}
						</div>
					  </div>					  
					</div>
				  </div>
				</div>
			  </div>
			</div>
			<div className="popup popup_purchase mfp-hide" id="popup-purchase">
			  <div className="popup__item" style={{display: "block"}}>
				<div className="popup__title h4">Checkout</div>
				<div className="popup__info">You are about to purchase <strong>C O I N Z</strong> from <strong>UI8</strong></div>
				<div className="popup__table">
				  <div className="popup__row">
					<div className="popup__col">0.007</div>
					<div className="popup__col">ETH</div>
				  </div>
				  <div className="popup__row">
					<div className="popup__col">Your balance</div>
					<div className="popup__col">8.498 ETH</div>
				  </div>
				  <div className="popup__row">
					<div className="popup__col">Service fee</div>
					<div className="popup__col">0 ETH</div>
				  </div>
				  <div className="popup__row">
					<div className="popup__col">You will pay</div>
					<div className="popup__col">0.007 ETH</div>
				  </div>
				</div>
				<div className="popup__attention">
				  <div className="popup__preview">
					<svg className="icon icon-info-circle">
					  <use xlinkHref="#icon-info-circle"></use>
					</svg>
				  </div>
				  <div className="popup__details">
					<div className="popup__category">This creator is not verified</div>
					<div className="popup__text">Purchase this item at your own risk</div>
				  </div>
				</div>
				<div className="popup__btns">
				  <button className="button popup__button">I understand, continue</button>
				  <button className="button-stroke popup__button js-popup-close">Cancel</button>
				</div>
			  </div>
			  <div className="popup__item">
				<div className="popup__title h4">Folow steps</div>
				<div className="steps">
				  <div className="steps__item">
					<div className="steps__head">
					  <div className="steps__icon">
						<div className="loader-circle"></div>
					  </div>
					  <div className="steps__details">
						<div className="steps__info">Purchasing</div>
						<div className="steps__text">Sending transaction with your wallet</div>
					  </div>
					</div>
				  </div>
				</div>
				<div className="popup__attention">
				  <div className="popup__preview">
					<svg className="icon icon-info-circle">
					  <use xlinkHref="#icon-info-circle"></use>
					</svg>
				  </div>
				  <div className="popup__details">
					<div className="popup__category">This creator is not verified</div>
					<div className="popup__text">Purchase this item at your own risk</div>
				  </div>
				  <div className="popup__avatar"><img src={process.env.SITE_ROOT+"img/content/avatar-3.jpg"} alt="Avatar"/></div>
				</div>
				<div className="popup__btns">
				  <button className="button popup__button">I understand, continue</button>
				  <button className="button-stroke popup__button js-popup-close">Cancel</button>
				</div>
			  </div>
			  <div className="popup__item">
				<div className="success">
				  <div className="success__title h2">Yay! <span role="img" aria-label="firework">??</span></div>
				  <div className="success__info">You successfully purchased <span>C O I N Z</span> from UI8</div>
				  <div className="success__table">
					<div className="success__row">
					  <div className="success__col">Status</div>
					  <div className="success__col">Transaction ID</div>
					</div>
					<div className="success__row">
					  <div className="success__col">Processing</div>
					  <div className="success__col">0msx836930...87r398</div>
					</div>
				  </div>
				  <div className="success__stage">Time to show-off</div>
				  <div className="success__socials"><a className="success__social" href="https://www.facebook.com/ui8.net/" target="_blank">
					  <svg className="icon icon-facebook">
						<use xlinkHref="#icon-facebook"></use>
					  </svg></a><a className="success__social" href="https://twitter.com/ui8" target="_blank">
					  <svg className="icon icon-twitter">
						<use xlinkHref="#icon-twitter"></use>
					  </svg></a><a className="success__social" href="https://www.instagram.com/ui8net/" target="_blank">
					  <svg className="icon icon-instagram">
						<use xlinkHref="#icon-instagram"></use>
					  </svg></a><a className="success__social" href="https://www.pinterest.com/ui8m/" target="_blank">
					  <svg className="icon icon-pinterest">

						<use xlinkHref="#icon-pinterest"></use>
					  </svg></a></div>
				</div>
			  </div>
			</div>
			<div className="popup popup_accept mfp-hide" id="popup-accept">
			  <div className="accept">
				<div className="accept__line">
				  <div className="accept__icon"></div>
				  <div className="accept__text">You are about to accept a bid for <strong>C O I N Z</strong> from <strong>UI8</strong></div>
				</div>
				<div className="accept__subtitle">1.46 ETH for 1 edition</div>
				<div className="accept__table">
				  <div className="accept__row">
					<div className="accept__col">Service fee</div>
					<div className="accept__col">0 ETH</div>
				  </div>
				  <div className="accept__row">
					<div className="accept__col">Total bid amount</div>
					<div className="accept__col">1.46 ETH</div>
				  </div>
				</div>
			  </div>
			  <div className="popup__btns">
				<button className="button popup__button">Accept bid</button>
				<button className="button-stroke popup__button js-popup-close">Cancel</button>
			  </div>
			</div>
			<div className="popup popup_sale mfp-hide" id="popup-sale">
			  <div className="popup__title h4">Put on sale</div>
			  <div className="popup__line"> 
				<div className="popup__icon">
				  <svg className="icon icon-coin">
					<use xlinkHref="#icon-coin"></use>
				  </svg>
				</div>
				<div className="popup__box">
				  <div className="popup__category">Instant sale price</div>
				  <div className="popup__text">Enter the price for which the item will be instanly sold</div>
				</div>
				<label className="switch">
				  <input className="switch__input" type="checkbox" checked="checked"/><span className="switch__inner"><span className="switch__box"></span></span>
				</label>
			  </div>
			  <div className="popup__table">
				<div className="popup__row">
				  <div className="popup__col">Enter your price</div>
				  <div className="popup__col">ETH</div>
				</div>
				<div className="popup__row">
				  <div className="popup__col">Service fee</div>
				  <div className="popup__col">1.5%</div>
				</div>
				<div className="popup__row">
				  <div className="popup__col">Total bid amount</div>
				  <div className="popup__col">0 ETH</div>
				</div>
			  </div>
			  <div className="popup__btns">
				<button className="button popup__button">Continue</button>
				<button className="button-stroke popup__button js-popup-close">Cancel</button>
			  </div>
			</div>
			<div className="popup popup_price mfp-hide" id="popup-price">
			  <div className="popup__title h4">Change price</div>
			  <div className="field">
				<div className="field__label">new price</div>
				<div className="field__wrap">
				  <input className="field__input" name="price" type="text" value="1.46" required />
				  <div className="field__currency">ETH</div>
				</div>
			  </div>
			  <div className="popup__btns">
				<button className="button-purple popup__button js-popup-close">Change price</button>
				<button className="button-stroke popup__button js-popup-close">Cancel</button>
			  </div>
			</div>
			<div className="popup popup_transfer mfp-hide" id="popup-transfer">
			  <div className="popup__title h4">Transfer token</div>
			  <div className="popup__note">You can transfer tokens from your address to another</div>
			  <div className="popup__subtitle">Receiver address</div>
			  <div className="popup__field">
				<div className="popup__wrap">
				  <input className="popup__input" type="text" name="address" placeholder="Paste address" required />
				</div>
			  </div>
			  <div className="popup__btns">
				<button className="button popup__button js-popup-close">Continue</button>
				<button className="button-stroke popup__button js-popup-close">Cancel</button>
			  </div>
			</div>
			<div className="popup popup_remove mfp-hide" id="popup-remove">
			  <div className="popup__title h4">Remove from sale</div>
			  <div className="popup__note">Do you really want to remove your item from sale? You can put it on sale anytime</div>
			  <div className="popup__btns">
				<button className="button popup__button js-popup-close">Remove now</button>
				<button className="button-stroke popup__button js-popup-close">Cancel</button>
			  </div>
			</div>
			<div className="popup popup_burn mfp-hide" id="popup-burn">
			  <div className="popup__title h4">Burn token</div>
			  <div className="popup__note">Are you sure to burn this token? This action cannot be undone. Token will be transfered to zero address</div>
			  <div className="popup__btns">
				<button className="button-purple popup__button js-popup-close">Continue</button>
				<button className="button-stroke popup__button js-popup-close">Cancel</button>
			  </div>
			</div>
			<div className="popup popup_report mfp-hide" id="popup-report">
			  <div className="popup__title h4">Report</div>
			  <div className="popup__note">Describe why you think this item should be removed from marketplace</div>
			  <div className="field">
				<div className="field__label">message</div>
				<div className="field__wrap">
				  <textarea className="field__textarea" name="message" placeholder="Tell us the details" required></textarea>
				</div>
			  </div>
			  <div className="popup__btns">
				<button className="button-purple popup__button js-popup-close">Send now</button>
				<button className="button-stroke popup__button js-popup-close">Cancel</button>
			  </div>
			</div>
			<div className="popup popup_bid mfp-hide" id="popup-bid">
			  <div className="popup__title h4">Place a bid</div>
			  <div className="popup__info">You are about to purchase <strong>C O I N Z</strong> from <strong>UI8</strong></div>
			  <div className="popup__subtitle">Your bid</div>
			  <div className="popup__table">
				<div className="popup__row">
				  <div className="popup__col">Enter bid</div>
				  <div className="popup__col">
					<div className="popup__bid">
					  <input className="popup__rate" type="tel" name="bid"/>
					  <div className="popup__currency">ETH</div>
					</div>
				  </div>
				</div>
				<div className="popup__row">
				  <div className="popup__col">Your balance</div>
				  <div className="popup__col">8.498 ETH</div>
				</div>
				<div className="popup__row">
				  <div className="popup__col">Service fee</div>
				  <div className="popup__col">0 ETH</div>
				</div>
				<div className="popup__row">
				  <div className="popup__col">Total bid amount</div>
				  <div className="popup__col">0 ETH</div>
				</div>
			  </div>
			  <div className="popup__btns"><a className="button popup__button js-popup-open" href="#popup-wallet" data-effect="mfp-zoom-in">Place a bid</a>
				<button className="button-stroke popup__button js-popup-close">Cancel</button>
			  </div>
			</div>
			<div className="popup popup_wallet mfp-hide" id="popup-wallet">
			  <div className="popup__title h4">Folow steps</div>
			  <div className="steps">
				<div className="steps__item">
				  <div className="steps__head">
					<div className="steps__icon">
					  <svg className="icon icon-upload-file">
						<use xlinkHref="#icon-upload-file"></use>
					  </svg>
					</div>
					<div className="steps__details">
					  <div className="steps__info">Deposit ETH</div>
					  <div className="steps__text">Send transaction with your wallet</div>
					</div>
				  </div>
				  <button className="button steps__button">Start now</button>
				</div>
				<div className="steps__item">
				  <div className="steps__head">
					<div className="steps__icon">
					  <svg className="icon icon-check">
						<use xlinkHref="#icon-check"></use>
					  </svg>
					</div>
					<div className="steps__details">
					  <div className="steps__info">Approve</div>
					  <div className="steps__text">Checking balance and approving</div>
					</div>
				  </div>
				  <button className="button steps__button disabled">Start now</button>
				</div>
				<div className="steps__item">
				  <div className="steps__head">
					<div className="steps__icon">
					  <svg className="icon icon-pencil">
						<use xlinkHref="#icon-pencil"></use>
					  </svg>
					</div>
					<div className="steps__details">
					  <div className="steps__info">Signature</div>
					  <div className="steps__text">Create a signature to place a bit</div>
					</div>
				  </div>
				  <button className="button steps__button disabled js-popup-close">Start now</button>
				</div>
			  </div>
			</div>
		</div>
		{/* Footer */}
		<div style={{display: "none"}}><svg width="0" height="0">
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-search">
<path d="M6.667 1.334c2.945 0 5.333 2.388 5.333 5.333a5.31 5.31 0 0 1-1.12 3.27l3.592 3.592c.26.26.26.682 0 .943s-.682.26-.943 0l-3.591-3.592a5.31 5.31 0 0 1-3.27 1.12c-2.946 0-5.333-2.388-5.333-5.333s2.388-5.333 5.333-5.333zm0 1.333a4 4 0 1 0 0 8 4 4 0 1 0 0-8z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-notification">
<path d="M8.833 12.861c.368 0 .679.313.516.643-.072.146-.169.281-.289.398-.281.276-.663.431-1.061.431s-.779-.155-1.061-.431a1.47 1.47 0 0 1-.289-.398c-.163-.33.148-.643.516-.643h1.667zM8 1.667c2.982 0 5.4 2.382 5.4 5.321v4.106h.011a.59.59 0 0 1 .589.589.59.59 0 0 1-.589.589H2.589A.59.59 0 0 1 2 11.683a.59.59 0 0 1 .589-.589H2.6V6.988c0-2.939 2.418-5.321 5.4-5.321zm0 1.178c-2.32 0-4.2 1.855-4.2 4.142v4.106h8.4V6.988c0-2.288-1.88-4.142-4.2-4.142z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-copy">
<path d="M11.988 9.672c.015.249.276.418.487.285 1.315-.825 2.19-2.288 2.19-3.956a4.67 4.67 0 0 0-4.667-4.667c-1.667 0-3.131.875-3.956 2.19-.133.212.035.472.285.487 2.984.179 5.481 2.679 5.66 5.66zm-1.323.329a4.67 4.67 0 0 1-4.667 4.667 4.67 4.67 0 0 1-4.667-4.667 4.67 4.67 0 0 1 4.667-4.667 4.67 4.67 0 0 1 4.667 4.667z"></path>
</symbol> 
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-user">
<path d="M8 .668a4 4 0 0 1 4 4c0 1.296-.617 2.449-1.573 3.18 2.104.93 3.573 3.037 3.573 5.487v1.333c0 .368-.298.667-.667.667s-.667-.298-.667-.667v-1.333a4.67 4.67 0 0 0-4.645-4.667H8h0l-.021-.001-.193.006a4.67 4.67 0 0 0-4.453 4.662v1.333c0 .368-.298.667-.667.667S2 15.036 2 14.668v-1.333c0-2.45 1.468-4.557 3.573-5.489C4.617 7.117 4 5.964 4 4.668a4 4 0 0 1 4-4zm0 1.333c-1.473 0-2.667 1.194-2.667 2.667S6.527 7.335 8 7.335s2.667-1.194 2.667-2.667S9.473 2.001 8 2.001z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-image">
<path d="M8.001 1.334a28.06 28.06 0 0 1 3.639.246c1.464.193 2.588 1.317 2.782 2.782.133 1.007.246 2.266.246 3.639a28.05 28.05 0 0 1-.246 3.639c-.193 1.464-1.317 2.588-2.782 2.782-1.007.133-2.266.246-3.639.246s-2.632-.113-3.639-.246c-1.465-.193-2.588-1.317-2.782-2.782a28.06 28.06 0 0 1-.246-3.639 28.06 28.06 0 0 1 .246-3.639c.193-1.465 1.317-2.588 2.782-2.782a28.06 28.06 0 0 1 3.639-.246zm0 1.333c-1.301 0-2.501.107-3.464.235-.867.114-1.52.768-1.635 1.635-.127.963-.235 2.163-.235 3.464 0 1.055.071 2.043.165 2.892l1.086-1.087a2 2 0 0 1 2.828 0l.114.114c.26.26.682.26.943 0l1.448-1.448a2 2 0 0 1 2.828 0l1.196 1.196-.168 1.718-1.971-1.971c-.26-.26-.682-.26-.943 0l-1.448 1.448a2 2 0 0 1-2.828 0l-.114-.114c-.26-.26-.682-.26-.943 0l-1.605 1.606a1.88 1.88 0 0 0 1.28.745c.963.127 2.163.235 3.464.235a26.72 26.72 0 0 0 3.464-.235c.867-.114 1.52-.768 1.635-1.635.127-.963.235-2.163.235-3.464s-.107-2.501-.235-3.464c-.114-.867-.768-1.52-1.635-1.635-.963-.127-2.163-.235-3.464-.235zm-2.001 2c.736 0 1.333.597 1.333 1.333s-.597 1.333-1.333 1.333-1.333-.597-1.333-1.333.597-1.333 1.333-1.333z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-exit">
<path d="M10.668 1.334c.866 0 1.519.045 2.005.104 1.044.128 1.728.94 1.825 1.92.086.863.169 2.301.169 4.642l-.169 4.642c-.098.98-.781 1.792-1.825 1.92a16.68 16.68 0 0 1-2.005.104 16.68 16.68 0 0 1-2.005-.104c-1.044-.128-1.728-.94-1.825-1.92l-.124-1.951c-.014-.368.273-.677.641-.691s.677.273.691.641l.119 1.869c.043.427.301.685.66.729a15.36 15.36 0 0 0 1.844.094c.821 0 1.419-.042 1.844-.094.36-.044.618-.301.66-.729.08-.806.163-2.198.163-4.51l-.163-4.51c-.043-.428-.301-.685-.66-.729-.424-.052-1.022-.094-1.844-.094s-1.42.042-1.844.094c-.36.044-.618.301-.66.729l-.119 1.869c-.014.368-.323.655-.691.641s-.655-.323-.641-.691l.124-1.951c.098-.98.781-1.792 1.825-1.92.486-.059 1.139-.104 2.005-.104zM4.805 5.196c.26.26.26.682 0 .943L3.61 7.334h6.391c.368 0 .667.298.667.667s-.298.667-.667.667H3.61l1.195 1.195c.26.26.26.682 0 .943s-.682.26-.943 0L1.529 8.472c-.26-.26-.26-.682 0-.943l2.333-2.333c.26-.26.682-.26.943 0z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-bulb">
<path d="M7.999 0c2.946 0 5.333 2.388 5.333 5.333 0 1.684-.781 3.186-2 4.164v1.17c0 .591-.256 1.122-.663 1.488L10.668 14a2 2 0 0 1-2 2H7.335a2 2 0 0 1-2-2v-1.841c-.41-.366-.668-.899-.668-1.492v-1.17c-1.219-.977-2-2.479-2-4.164C2.666 2.388 5.054 0 7.999 0zm1.335 12.667l-2.667-.001V14c0 .368.298.667.667.667h1.333c.368 0 .667-.298.667-.667v-1.333h0zM7.999 1.333a4 4 0 0 0-4 4A3.99 3.99 0 0 0 5.5 8.457l.499.4v1.81c0 .368.298.667.667.667h.668V7.609L6.196 6.471c-.26-.26-.26-.682 0-.943s.682-.26.943 0h0L8 6.39l.862-.862c.26-.26.682-.26.943 0s.26.682 0 .943h0L8.667 7.609v3.724h.666c.368 0 .667-.298.667-.667v-1.81l.499-.4a3.99 3.99 0 0 0 1.501-3.123 4 4 0 0 0-4-4z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-arrow-next">
<path d="M10.39 3.765c.464-.375 1.187-.349 1.615.057l3.692 3.5a.91.91 0 0 1 0 1.357l-3.692 3.5c-.428.406-1.151.431-1.615.057s-.493-1.007-.065-1.413L12.247 9H1.143C.512 9 0 8.552 0 8s.512-1 1.143-1h11.104l-1.922-1.822c-.428-.406-.399-1.038.065-1.413z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-arrow-prev">
<path d="M5.61 12.235c-.464.375-1.187.349-1.615-.057l-3.692-3.5a.91.91 0 0 1 0-1.357l3.692-3.5c.428-.406 1.151-.431 1.615-.057s.493 1.007.065 1.413L3.753 7h11.104C15.488 7 16 7.448 16 8s-.512 1-1.143 1H3.753l1.922 1.822c.428.406.399 1.038-.065 1.413z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-arrow-bottom">
<path d="M15.039 3.961c-.653-.653-1.713-.653-2.366 0L8 8.634 3.327 3.961c-.653-.653-1.713-.653-2.366 0s-.653 1.713 0 2.366l5.856 5.856c.653.653 1.713.653 2.366 0l5.856-5.856c.653-.653.653-1.713 0-2.366z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-stop">
<path d="M8 1.333a28.06 28.06 0 0 1 3.639.246c1.465.193 2.588 1.317 2.782 2.782.133 1.007.246 2.266.246 3.639s-.113 2.632-.246 3.639c-.193 1.465-1.317 2.588-2.782 2.782-1.007.133-2.266.246-3.639.246s-2.632-.113-3.639-.246c-1.465-.193-2.588-1.317-2.782-2.782A28.06 28.06 0 0 1 1.333 8a28.06 28.06 0 0 1 .246-3.639c.193-1.465 1.317-2.588 2.782-2.782A28.06 28.06 0 0 1 8 1.333zm0 1.333c-1.301 0-2.501.107-3.464.235-.867.114-1.52.768-1.635 1.635A26.73 26.73 0 0 0 2.667 8c0 1.301.107 2.501.235 3.464.114.867.768 1.52 1.635 1.635.963.127 2.163.235 3.464.235s2.501-.107 3.464-.235c.867-.114 1.52-.768 1.635-1.635.127-.963.235-2.163.235-3.464s-.107-2.501-.235-3.464c-.114-.867-.768-1.52-1.635-1.635A26.73 26.73 0 0 0 8 2.667z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-play">
<path d="M1.8 2.923c0-1.567 1.72-2.525 3.053-1.701l8.2 5.076a2 2 0 0 1 0 3.401l-8.2 5.076c-1.332.825-3.053-.134-3.053-1.701V2.923z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-full-screen">
<path d="M8 1.333a28.06 28.06 0 0 1 3.639.246c1.465.193 2.588 1.317 2.782 2.782.133 1.007.246 2.266.246 3.639s-.113 2.632-.246 3.639c-.193 1.465-1.317 2.588-2.782 2.782-1.007.133-2.266.246-3.639.246s-2.632-.113-3.639-.246c-1.465-.193-2.588-1.317-2.782-2.782A28.06 28.06 0 0 1 1.333 8a28.06 28.06 0 0 1 .246-3.639c.193-1.465 1.317-2.588 2.782-2.782A28.06 28.06 0 0 1 8 1.333zm-4.667 8c-.368 0-.667.298-.667.667h0v1.333a2 2 0 0 0 2 2h0H6c.368 0 .667-.298.667-.667S6.368 12 6 12h0-1.333C4.298 12 4 11.701 4 11.333h0V10c0-.368-.298-.667-.667-.667zm9.333 0c-.368 0-.667.298-.667.667h0v1.333c0 .368-.298.667-.667.667h0H10c-.368 0-.667.298-.667.667s.298.667.667.667h0 1.333a2 2 0 0 0 2-2h0V10c0-.368-.298-.667-.667-.667zM6 2.666H4.666a2 2 0 0 0-2 2V6c0 .368.298.667.667.667S4 6.368 4 6V4.666C4 4.298 4.298 4 4.666 4H6c.368 0 .667-.298.667-.667S6.368 2.666 6 2.666zm5.333 0H10c-.368 0-.667.298-.667.667S9.631 4 10 4h1.333c.368 0 .667.298.667.667V6c0 .368.298.667.667.667s.667-.298.667-.667V4.666a2 2 0 0 0-2-2z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-volume">
<path d="M10.667 2.667c-.368 0-.667.298-.667.667s.298.667.667.667a4 4 0 1 1 0 8c-.368 0-.667.298-.667.667s.298.667.667.667C13.612 13.334 16 10.946 16 8s-2.388-5.333-5.333-5.333zm0 2.667c-.368 0-.667.298-.667.667s.298.667.667.667A1.33 1.33 0 0 1 12 8c0 .736-.597 1.333-1.333 1.333-.368 0-.667.298-.667.667s.298.667.667.667A2.67 2.67 0 0 0 13.334 8a2.67 2.67 0 0 0-2.667-2.667zM3.333 6l3.088-2.895c.852-.798 2.245-.195 2.245.973v7.845c0 1.167-1.394 1.771-2.245.973L3.333 10h-2C.597 10 0 9.403 0 8.667V7.334C0 6.597.597 6 1.333 6h2z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-arrow-expand">
<path d="M11.281 9.207a.75.75 0 0 0 .719-.779l-.143-3.567a.75.75 0 0 0-.719-.719l-3.567-.143a.75.75 0 0 0-.779.719.75.75 0 0 0 .719.779l1.856.074-5.148 5.148a.75.75 0 0 0 0 1.06.75.75 0 0 0 1.06 0l5.148-5.148.074 1.856a.75.75 0 0 0 .779.719z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-add-square">
<path d="M8 1.333a28.06 28.06 0 0 1 3.639.246c1.465.193 2.588 1.317 2.782 2.782.133 1.007.246 2.266.246 3.639s-.113 2.632-.246 3.639c-.193 1.465-1.317 2.588-2.782 2.782-1.007.133-2.266.246-3.639.246s-2.632-.113-3.639-.246c-1.465-.193-2.588-1.317-2.782-2.782A28.06 28.06 0 0 1 1.333 8a28.06 28.06 0 0 1 .246-3.639c.193-1.465 1.317-2.588 2.782-2.782A28.06 28.06 0 0 1 8 1.333zm0 1.333c-1.301 0-2.501.107-3.464.235-.867.114-1.52.768-1.635 1.635-.127.963-.235 2.163-.235 3.464s.107 2.501.235 3.464c.114.867.768 1.52 1.635 1.635.963.127 2.163.235 3.464.235s2.501-.107 3.464-.235c.867-.114 1.52-.768 1.635-1.635.127-.963.235-2.163.235-3.464s-.107-2.501-.235-3.464c-.114-.867-.768-1.52-1.635-1.635A26.73 26.73 0 0 0 8 2.666zm0 2c.368 0 .667.298.667.667h0v2h2c.368 0 .667.298.667.667s-.298.667-.667.667h0-2v2c0 .368-.298.667-.667.667s-.667-.298-.667-.667h0v-2h-2c-.368 0-.667-.298-.667-.667s.298-.667.667-.667h0 2v-2c0-.368.298-.667.667-.667z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-scatter-up">
<path d="M13.334 12.667c.368 0 .667.298.667.667s-.299.667-.667.667-.667-.298-.667-.667.298-.667.667-.667zm-5.333 0c.368 0 .667.298.667.667S8.369 14 8 14s-.667-.298-.667-.667.298-.667.667-.667zm-5.333 0c.368 0 .667.298.667.667S3.035 14 2.667 14 2 13.702 2 13.334s.298-.667.667-.667zM13.334 10c.368 0 .667.298.667.667s-.299.667-.667.667-.667-.299-.667-.667.298-.667.667-.667zM8 10c.368 0 .667.298.667.667s-.298.667-.667.667-.667-.299-.667-.667S7.632 10 8 10zM2.667 7.333a2 2 0 0 1 0 4 2 2 0 0 1-2-2 2 2 0 0 1 2-2zm0 1.333c-.368 0-.667.298-.667.667s.298.667.667.667.667-.298.667-.667-.298-.667-.667-.667zm10.667-1.333c.368 0 .667.298.667.667s-.299.667-.667.667-.667-.298-.667-.667.298-.667.667-.667zM8 4.667a2 2 0 1 1 0 4 2 2 0 1 1 0-4zM8 6c-.368 0-.667.298-.667.667s.298.667.667.667.667-.298.667-.667S8.369 6 8 6zm5.333-4a2 2 0 1 1 0 4 2 2 0 1 1 0-4zm0 1.333c-.368 0-.667.298-.667.667s.299.667.667.667S14 4.368 14 4s-.298-.667-.667-.667z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-heart">
<path d="M11 2.112c2.393 0 4.333 1.94 4.333 4.333 0 4.245-4.647 6.59-6.542 7.37-.511.21-1.071.21-1.582 0-1.896-.78-6.543-3.124-6.543-7.37 0-2.393 1.94-4.333 4.333-4.333a4.32 4.32 0 0 1 3 1.206 4.32 4.32 0 0 1 3-1.206zm0 1.333c-.807 0-1.537.317-2.077.835l-.462.443c-.258.248-.665.248-.923 0l-.462-.443c-.54-.518-1.27-.835-2.077-.835a3 3 0 0 0-3 3c0 1.588.86 2.9 2.101 3.978s2.728 1.794 3.615 2.159a.73.73 0 0 0 .567 0c.888-.365 2.373-1.08 3.615-2.159S14 8.034 14 6.445a3 3 0 0 0-3-3z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-heart-fill">
<path d="M8 3.339a4.32 4.32 0 0 0-3-1.206c-2.393 0-4.333 1.94-4.333 4.333 0 4.246 4.647 6.59 6.543 7.37.511.21 1.071.21 1.582 0 1.896-.78 6.543-3.124 6.543-7.37 0-2.393-1.94-4.333-4.333-4.333a4.32 4.32 0 0 0-3 1.206z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-candlesticks-up">
<path d="M4.667 2.667c.368 0 .667.298.667.667v4.781A2 2 0 0 1 6.667 10v1.333a2 2 0 0 1-1.333 1.886v2.114c0 .368-.298.667-.667.667S4 15.702 4 15.333v-2.114a2 2 0 0 1-1.333-1.886V10A2 2 0 0 1 4 8.114V3.333c0-.368.298-.667.667-.667zM11.334 0c.368 0 .667.298.667.667l.001.781a2 2 0 0 1 1.333 1.886v4a2 2 0 0 1-1.333 1.886L12 12.667c0 .368-.298.667-.667.667s-.667-.298-.667-.667l-.001-3.448a2 2 0 0 1-1.333-1.886v-4a2 2 0 0 1 1.333-1.886l.001-.781c0-.368.298-.667.667-.667zM4.667 9.333c-.335 0-.612.247-.659.568L4 10v1.333c0 .368.298.667.667.667.335 0 .612-.247.659-.568l.007-.099V10c0-.368-.298-.667-.667-.667zm6.667-6.667c-.335 0-.612.247-.659.568l-.007.099v4c0 .368.298.667.667.667.335 0 .612-.247.659-.568L12 7.333v-4c0-.368-.298-.667-.667-.667z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-close">
<path d="M.335.335c.446-.446 1.17-.446 1.616 0L8 6.384 14.049.335c.446-.446 1.17-.446 1.616 0s.446 1.17 0 1.616L9.616 8l6.049 6.049c.446.446.446 1.17 0 1.616s-1.17.446-1.616 0L8 9.616l-6.049 6.049c-.446.446-1.17.446-1.616 0s-.446-1.17 0-1.616L6.384 8 .335 1.951c-.446-.446-.446-1.17 0-1.616"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-upload-file">
<path d="M10.229.667c.707 0 1.386.281 1.886.781l1.105 1.105c.5.5.781 1.178.781 1.886v8.229c0 1.473-1.194 2.667-2.667 2.667H4.667C3.194 15.334 2 14.14 2 12.667V3.334C2 1.861 3.194.667 4.667.667h5.562zM9.333 2H4.667c-.693 0-1.263.529-1.327 1.205l-.006.128v9.333c0 .693.529 1.263 1.205 1.327l.128.006h6.667c.693 0 1.263-.529 1.327-1.205l.006-.128V5.334h-1.333a2 2 0 0 1-1.995-1.851l-.005-.149V2zM7.745 6.051c.242-.1.53-.052.727.145h0l2 2c.26.26.26.682 0 .943s-.682.26-.943 0h0l-.862-.862v3.057c0 .368-.298.667-.667.667s-.667-.298-.667-.667h0V8.276l-.862.862c-.26.26-.682.26-.943 0s-.26-.682 0-.943h0l2-2c.064-.064.138-.112.216-.145zm2.922-3.977v1.259c0 .368.298.667.667.667h1.259c-.065-.188-.173-.361-.317-.505l-1.105-1.105c-.144-.144-.317-.251-.505-.317z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-plus">
<path d="M8.667 4.667C8.667 4.298 8.368 4 8 4s-.667.298-.667.667v2.667H4.667C4.298 7.333 4 7.632 4 8s.298.667.667.667h2.667v2.667c0 .368.298.667.667.667s.667-.298.667-.667V8.667h2.667c.368 0 .667-.298.667-.667s-.298-.667-.667-.667H8.667V4.667z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-circle-close">
<path d="M8 1.333A6.67 6.67 0 0 1 14.666 8 6.67 6.67 0 0 1 8 14.666 6.67 6.67 0 0 1 1.333 8 6.67 6.67 0 0 1 8 1.333zm0 1.333C5.054 2.666 2.666 5.054 2.666 8S5.054 13.333 8 13.333 13.333 10.945 13.333 8 10.945 2.666 8 2.666zm2.471 2.862c.26.26.26.682 0 .943L8.942 8l1.529 1.529c.26.26.26.682 0 .943s-.682.26-.943 0L8 8.942l-1.529 1.529c-.26.26-.682.26-.943 0s-.26-.682 0-.943L7.057 8 5.528 6.471c-.26-.26-.26-.682 0-.943s.682-.26.943 0L8 7.057l1.529-1.529c.26-.26.682-.26.943 0z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-wallet">
<path d="M12.667 2c1.416 0 2.574 1.104 2.661 2.498l.005.169v6.667c0 1.416-1.104 2.574-2.498 2.661l-.169.005H3.334C1.918 14 .759 12.896.672 11.502l-.005-.169V4.667c0-1.416 1.104-2.574 2.498-2.661L3.334 2h9.333zm0 1.333H3.334C2.597 3.333 2 3.93 2 4.667v6.667c0 .736.597 1.333 1.333 1.333h9.333c.736 0 1.333-.597 1.333-1.333h-2c-1.841 0-3.333-1.492-3.333-3.333S10.159 4.667 12 4.667h2c0-.736-.597-1.333-1.333-1.333zM14 6h-2a2 2 0 1 0 0 4h2V6zm-2 1.333c.368 0 .667.298.667.667s-.298.667-.667.667-.667-.298-.667-.667.298-.667.667-.667z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-check">
<path d="M15.665 2.668c.446.446.446 1.17 0 1.616l-9.143 9.143c-.446.446-1.17.446-1.616 0L.335 8.855c-.446-.446-.446-1.17 0-1.616s1.17-.446 1.616 0l3.763 3.763 8.335-8.335c.446-.446 1.17-.446 1.616 0z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-circle-and-square">
<path d="M13.334 5.334c.736 0 1.333.597 1.333 1.333v6.667c0 .736-.597 1.333-1.333 1.333H6.667c-.736 0-1.333-.597-1.333-1.333v-.998a.35.35 0 0 1 .371-.343l.296.007a6 6 0 0 0 6-6l-.007-.296a.35.35 0 0 1 .343-.371h.998zm-7.333-4a4.67 4.67 0 0 1 4.667 4.667 4.67 4.67 0 0 1-4.667 4.667 4.67 4.67 0 0 1-4.667-4.667 4.67 4.67 0 0 1 4.667-4.667z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-pen">
<path d="M14.11 9.444c.491.491.491 1.287 0 1.778l-2.889 2.889c-.491.491-1.287.491-1.778 0a.63.63 0 0 1 0-.889l3.778-3.778a.63.63 0 0 1 .889 0zM3.027 1.584l.067.001 5.43.776a4 4 0 0 1 3.059 2.268h0l1.22 2.615c.118.254.066.555-.133.753h0L7.997 12.67c-.198.198-.499.251-.753.133h0l-2.615-1.22a4 4 0 0 1-2.268-3.059h0l-.776-5.43c-.034-.237.243-.323.412-.153h0l3.912 3.912c.084.084.114.207.1.325-.006.051-.009.104-.009.157 0 .736.597 1.333 1.333 1.333s1.333-.597 1.333-1.333S8.07 6 7.333 6a1.35 1.35 0 0 0-.157.009.39.39 0 0 1-.325-.1h0L2.94 1.997c-.169-.169-.084-.446.153-.412z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-lightning">
<path d="M2.764 8.943L9.002.307a.67.67 0 0 1 1.198.5L9.334 6h3.363a.67.67 0 0 1 .54 1.057L7 15.694a.67.67 0 0 1-1.198-.5L6.668 10H3.305a.67.67 0 0 1-.54-1.057z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-home">
<path d="M13.333 12.534V5.978l.99.594c.316.189.725.087.915-.229s.087-.725-.229-.915L11.661 3.42 9.1 1.877h0l-.45-.263-.086-.044c-.101-.049-.188-.082-.278-.102-.189-.042-.385-.042-.574 0-.09.02-.178.053-.279.102l-.084.043-.451.263h0L4.334 3.422.99 5.429c-.316.189-.418.599-.229.915s.599.418.915.229l.99-.594v6.556c0 .747 0 1.12.145 1.405.128.251.332.455.583.583.285.145.659.145 1.405.145h1.2v-4a2 2 0 0 1 4 0v4h1.2c.747 0 1.12 0 1.405-.145.251-.128.455-.332.583-.583.145-.285.145-.659.145-1.405z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-close-circle-fill">
<path d="M8 1.333A6.67 6.67 0 0 1 14.666 8 6.67 6.67 0 0 1 8 14.666 6.67 6.67 0 0 1 1.333 8 6.67 6.67 0 0 1 8 1.333zm1.529 4.195L8 7.057 6.471 5.528c-.26-.26-.682-.26-.943 0s-.26.682 0 .943L7.057 8 5.528 9.528c-.26.26-.26.682 0 .943s.682.26.943 0L8 8.942l1.529 1.529c.26.26.682.26.943 0s.26-.682 0-.943L8.942 8l1.529-1.529c.26-.26.26-.682 0-.943s-.682-.26-.943 0z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-edit">
<path d="M13.283 14c.368 0 .667.298.667.667s-.299.667-.667.667H2.617c-.368 0-.667-.298-.667-.667S2.248 14 2.617 14h10.667zM12.031 1.138l1.448 1.448a2 2 0 0 1 0 2.828l-6.862 6.862c-.25.25-.589.39-.943.39H3.283c-.736 0-1.333-.597-1.333-1.333V8.943c0-.354.14-.693.391-.943l6.862-6.862a2 2 0 0 1 2.828 0zM3.617 8.609l-.333.333v2.391h2.391L6.007 11l-2.391-2.39zm5-5L4.56 7.666l2.391 2.39L11.007 6 8.617 3.609zm1.529-1.529l-.586.586 2.39 2.391.586-.586c.26-.26.26-.682 0-.943l-1.448-1.448c-.26-.26-.682-.26-.943 0z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-globe">
<path d="M8.001 1.334a6.67 6.67 0 0 1 6.631 5.971l.003.029.033.667a6.67 6.67 0 0 1-6.667 6.667h-.003l-.231-.004a6.67 6.67 0 0 1-6.4-5.996l-.033-.667c0-.225.011-.447.033-.667h0a6.67 6.67 0 0 1 6.632-6h0 .002zm1.98 7.334H6.018c.077 1.396.391 2.599.817 3.451.532 1.065 1.021 1.216 1.164 1.216s.632-.151 1.164-1.216c.426-.852.74-2.055.817-3.451zm3.312 0h-1.977c-.081 1.623-.452 3.075-1.009 4.144a5.34 5.34 0 0 0 2.986-4.144zm-8.61 0H2.709c.228 1.83 1.384 3.373 2.982 4.142-.557-1.069-.928-2.519-1.008-4.141zM5.69 3.192l-.141.07c-1.525.79-2.619 2.295-2.841 4.07h1.974c.081-1.622.452-3.073 1.008-4.141zm2.309-.525c-.143 0-.632.151-1.164 1.216-.426.852-.74 2.055-.817 3.451h3.963c-.077-1.396-.391-2.599-.817-3.451-.532-1.065-1.021-1.216-1.164-1.216zm2.308.523l.049.096c.529 1.059.882 2.472.96 4.047h1.976c-.229-1.831-1.386-3.374-2.985-4.142z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-share">
<path d="M10.702 6.063l1.279.098c.99.104 1.779.806 1.898 1.843.068.591.122 1.444.122 2.663l-.122 2.663c-.118 1.036-.906 1.739-1.896 1.843-.787.083-2.042.161-3.982.161s-3.195-.078-3.982-.161c-.99-.104-1.778-.807-1.896-1.843C2.054 12.739 2 11.886 2 10.667l.122-2.663c.119-1.037.908-1.739 1.897-1.843l1.279-.098c.368-.02.682.263.701.63s-.263.682-.63.701l-1.21.092c-.417.044-.671.3-.713.669-.06.529-.113 1.33-.113 2.511l.113 2.511c.042.369.295.625.711.669C4.887 13.924 6.093 14 8 14l3.842-.154c.416-.044.669-.299.711-.669.06-.529.113-1.33.113-2.511l-.113-2.511c-.042-.369-.296-.625-.713-.669l-1.21-.092c-.368-.02-.65-.334-.63-.701s.334-.65.701-.63zM8.471.862l2.333 2.333c.26.26.26.682 0 .943s-.682.26-.943 0L8.667 2.943v6.391c0 .368-.298.667-.667.667s-.667-.298-.667-.667V2.943L6.138 4.138c-.26.26-.682.26-.943 0s-.26-.682 0-.943L7.529.862c.26-.26.682-.26.943 0z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-more">
<path d="M3.333 6.667A1.34 1.34 0 0 1 4.667 8a1.34 1.34 0 0 1-1.333 1.333A1.34 1.34 0 0 1 2 8a1.34 1.34 0 0 1 1.333-1.333zm9.333 0A1.34 1.34 0 0 1 14 8a1.34 1.34 0 0 1-1.333 1.333A1.34 1.34 0 0 1 11.333 8a1.34 1.34 0 0 1 1.333-1.333zM8 6.667A1.34 1.34 0 0 1 9.333 8 1.34 1.34 0 0 1 8 9.334 1.34 1.34 0 0 1 6.667 8 1.34 1.34 0 0 1 8 6.667z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-instagram">
<path d="M10.666 1.333a4 4 0 0 1 3.995 3.8l.005.2v5.333a4 4 0 0 1-3.8 3.995l-.2.005H5.333a4 4 0 0 1-3.995-3.8l-.005-.2V5.333a4 4 0 0 1 3.8-3.995l.2-.005h5.333zm0 1.333H5.333c-1.473 0-2.667 1.194-2.667 2.667v5.333c0 1.473 1.194 2.667 2.667 2.667h5.333c1.473 0 2.667-1.194 2.667-2.667V5.333c0-1.473-1.194-2.667-2.667-2.667zm-2.666 2c1.841 0 3.333 1.492 3.333 3.333s-1.492 3.333-3.333 3.333S4.667 9.841 4.667 8 6.16 4.667 8.001 4.667zm0 1.333a2 2 0 1 0 0 4 2 2 0 1 0 0-4zm3.333-2c.368 0 .667.298.667.667s-.298.667-.667.667-.667-.298-.667-.667.298-.667.667-.667z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-facebook">
<path d="M8 1.333A6.67 6.67 0 0 1 14.666 8 6.67 6.67 0 0 1 8 14.666 6.67 6.67 0 0 1 1.333 8 6.67 6.67 0 0 1 8 1.333zm0 1.333C5.054 2.666 2.666 5.054 2.666 8c0 2.485 1.699 4.573 3.999 5.165V9.333H6c-.368 0-.667-.298-.667-.667S5.631 8 6 8h0 .667V6.667a2 2 0 0 1 2-2h0 .667c.368 0 .667.298.667.667S9.701 6 9.333 6h0-.667C8.298 6 8 6.298 8 6.667h0V8h1.333c.368 0 .667.298.667.667s-.298.667-.667.667h0H8v4h0c2.946 0 5.333-2.388 5.333-5.333S10.945 2.666 8 2.666z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-twitter">
<path d="M10.334 2c.508 0 1.057.117 1.511.265.233.076.505.181.768.32h0l.993-.198c1.142-.228 2.048.957 1.527 1.999h0l-.751 1.503C14.893 10.281 11.23 14 6.667 14c-2.945 0-4.709-1.094-5.681-2.456-.679-.952.032-2.208 1.135-2.211l.151-.001a6.57 6.57 0 0 1-.754-1.324c-.578-1.36-.755-3.042-.111-4.462.457-1.007 1.757-1.065 2.371-.29.366.462 1.015.989 1.817 1.404.354.183.715.333 1.069.445.038-.249.096-.508.185-.766.191-.561.54-1.171 1.159-1.635C8.633 2.234 9.421 2 10.334 2zm0 1.333c-2.723 0-2.425 2.747-2.347 3.254.006.042-.025.08-.067.079-1.939-.034-4.167-1.294-5.187-2.581-.031-.039-.091-.033-.112.012-.892 1.968.364 5.117 2.575 5.86.054.018.065.09.016.119-.948.555-2.386.588-3.087.59-.053 0-.084.059-.054.103.689.965 2.02 1.898 4.596 1.898 3.992 0 6.988-3.32 6.337-6.978-.002-.014 0-.029.006-.042h0l.929-1.858c.025-.05-.018-.106-.073-.095h0l-1.498.3a.07.07 0 0 1-.061-.017c-.356-.325-1.324-.642-1.974-.642z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-pinterest">
<path d="M8 1.333A6.67 6.67 0 0 1 14.666 8 6.67 6.67 0 0 1 8 14.666 6.67 6.67 0 0 1 1.333 8 6.67 6.67 0 0 1 8 1.333zm0 1.333C5.054 2.666 2.666 5.054 2.666 8c0 2.151 1.274 4.005 3.109 4.849l.702-2.524.88-3.17c.099-.355.466-.562.821-.464s.562.466.464.821l-.702 2.526c.834.177 1.419.026 1.811-.233.495-.327.813-.914.893-1.61s-.091-1.428-.481-1.969c-.375-.522-.969-.892-1.831-.892-1.281 0-2.043.554-2.415 1.236-.387.71-.4 1.645.011 2.466.165.329.031.73-.298.894s-.73.031-.894-.298c-.589-1.179-.602-2.577.011-3.701C5.376 4.779 6.614 4 8.333 4c1.305 0 2.295.588 2.913 1.446.604.839.836 1.909.723 2.9s-.585 1.977-1.483 2.57c-.766.506-1.752.668-2.903.407l-.535 1.925c.309.056.627.085.951.085 2.946 0 5.333-2.388 5.333-5.333S10.945 2.666 8 2.666z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-info-circle">
<path d="M8 1.334a6.67 6.67 0 0 1 6.667 6.667A6.67 6.67 0 0 1 8 14.667a6.67 6.67 0 0 1-6.667-6.667A6.67 6.67 0 0 1 8 1.334zm0 1.333c-2.946 0-5.333 2.388-5.333 5.333S5.054 13.334 8 13.334s5.333-2.388 5.333-5.333S10.945 2.667 8 2.667zm0 4.667c.368 0 .667.298.667.667h0v2.667c0 .368-.298.667-.667.667s-.667-.298-.667-.667h0V8.001c0-.368.298-.667.667-.667zm0-2.667c.368 0 .667.298.667.667s-.298.667-.667.667-.667-.298-.667-.667.298-.667.667-.667z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-coin">
<path d="M8 1.334a6.67 6.67 0 0 1 6.667 6.667A6.67 6.67 0 0 1 8 14.667a6.67 6.67 0 0 1-6.667-6.667A6.67 6.67 0 0 1 8 1.334zm0 1.333c-2.946 0-5.333 2.388-5.333 5.333S5.054 13.334 8 13.334s5.333-2.388 5.333-5.333S10.945 2.667 8 2.667zm0 1.333c.368 0 .667.298.667.667a2 2 0 0 1 2 2c0 .368-.298.667-.667.667s-.667-.298-.667-.667-.298-.667-.667-.667H7.162c-.274 0-.496.222-.496.496 0 .213.137.403.339.47l2.411.804a1.83 1.83 0 0 1-.578 3.564h-.171c0 .368-.298.667-.667.667s-.667-.298-.667-.667a2 2 0 0 1-2-2c0-.368.298-.667.667-.667s.667.298.667.667.298.667.667.667h1.504c.274 0 .496-.222.496-.496 0-.213-.136-.403-.339-.47l-2.411-.804a1.83 1.83 0 0 1 .578-3.564h.171c0-.368.298-.667.667-.667z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-close-circle">
<path d="M8 1.334a6.67 6.67 0 0 1 6.667 6.667A6.67 6.67 0 0 1 8 14.667a6.67 6.67 0 0 1-6.667-6.667A6.67 6.67 0 0 1 8 1.334zm0 1.333c-2.946 0-5.333 2.388-5.333 5.333S5.054 13.334 8 13.334s5.333-2.388 5.333-5.333S10.945 2.667 8 2.667zm2.471 2.862c.26.26.26.682 0 .943L8.943 8.001l1.529 1.529c.26.26.26.682 0 .943s-.682.26-.943 0L8 8.943l-1.529 1.529c-.26.26-.682.26-.943 0s-.26-.682 0-.943l1.529-1.529-1.529-1.529c-.26-.26-.26-.682 0-.943s.682-.26.943 0L8 7.058l1.529-1.529c.26-.26.682-.26.943 0z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-arrow-right-square">
<path d="M8 1.334c1.373 0 2.632.113 3.639.246 1.465.193 2.588 1.317 2.782 2.782a28.06 28.06 0 0 1 .246 3.639c0 1.372-.113 2.632-.246 3.639-.193 1.464-1.317 2.588-2.782 2.782-1.007.133-2.266.246-3.639.246s-2.632-.113-3.639-.246c-1.465-.193-2.588-1.317-2.782-2.782a28.06 28.06 0 0 1-.246-3.639 28.06 28.06 0 0 1 .246-3.639c.193-1.465 1.317-2.588 2.782-2.782A28.06 28.06 0 0 1 8 1.334zm0 1.333c-1.301 0-2.501.107-3.464.235-.867.114-1.52.768-1.635 1.635-.127.963-.235 2.163-.235 3.464s.107 2.501.235 3.464c.114.867.768 1.52 1.635 1.635.963.127 2.163.235 3.464.235s2.501-.107 3.464-.235c.867-.114 1.52-.768 1.635-1.635.127-.963.234-2.163.234-3.464a26.74 26.74 0 0 0-.234-3.464c-.114-.867-.768-1.52-1.635-1.635-.963-.127-2.163-.235-3.464-.235zM6.529 5.196c.26-.26.682-.26.943 0h0l2.333 2.333c.26.26.26.682 0 .943h0l-2.333 2.333c-.26.26-.682.26-.943 0s-.26-.682 0-.943h0l1.862-1.862-1.862-1.862c-.26-.26-.26-.682 0-.943z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-bag">
<path d="M8 1.333c1.612 0 2.957 1.145 3.267 2.666l.562.001a2.67 2.67 0 0 1 2.667 2.669l-.005.164-.333 5.333c-.084 1.349-1.162 2.412-2.494 2.495l-.168.005h-6.99c-1.352 0-2.48-1.009-2.646-2.333l-.016-.167-.333-5.333a2.67 2.67 0 0 1 2.498-2.828L4.172 4l.561-.001C5.042 2.478 6.387 1.333 8 1.333zm3.828 4h-.495V6c0 .368-.298.667-.667.667S10 6.368 10 6l-.001-.667h-4L6 6c0 .368-.298.667-.667.667S4.666 6.368 4.666 6v-.667h-.494c-.769 0-1.379.649-1.331 1.417l.333 5.333c.044.703.627 1.25 1.331 1.25h6.99c.704 0 1.287-.547 1.331-1.25l.333-5.333c.048-.768-.562-1.417-1.331-1.417zM8 2.666a2 2 0 0 0-1.886 1.333h3.772A2 2 0 0 0 8 2.666z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-pencil">
<path d="M12.885 2.219l.895.895c1.041 1.041 1.041 2.73 0 3.771l-6.565 6.565c-.359.359-.812.608-1.307.718l-2.174.483a2 2 0 0 1-2.386-2.386l.483-2.174c.11-.495.359-.948.718-1.307l6.565-6.565c1.041-1.041 2.73-1.041 3.771 0zM3.471 9.748c-.168.176-.286.395-.338.633l-.483 2.174c-.106.476.319.901.795.795l2.174-.483c.238-.053.457-.17.633-.338L3.471 9.748zm4.666-4.667L4.414 8.805l2.781 2.781 3.724-3.724-2.781-2.781zm3.805-1.919c-.521-.521-1.365-.521-1.886 0h0l-.976.976 2.781 2.781.976-.976c.521-.521.521-1.365 0-1.886h0z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-filter">
<path d="M12.263 1.333c1.597 0 2.55 1.78 1.664 3.109h0l-3.148 4.723c-.073.109-.112.238-.112.37h0v2.69a2 2 0 0 1-.94 1.696h0l-1.333.833c-1.332.833-3.06-.125-3.06-1.696h0V9.535c0-.132-.039-.26-.112-.37h0L2.073 4.442c-.886-1.329.067-3.109 1.664-3.109h0zm0 1.333H3.737a.67.67 0 0 0-.555 1.036l3.372 5.059c.073.11.112.238.112.37v3.927a.67.67 0 0 0 1.02.565l1.333-.833c.195-.122.313-.336.313-.565V9.131c0-.132.039-.26.112-.37l3.372-5.059a.67.67 0 0 0-.555-1.036z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-plus-circle">
<path d="M8.001 1.333A6.67 6.67 0 0 1 14.667 8a6.67 6.67 0 0 1-6.667 6.667A6.67 6.67 0 0 1 1.334 8a6.67 6.67 0 0 1 6.667-6.667zm0 2A4.67 4.67 0 0 0 3.334 8a4.67 4.67 0 0 0 4.667 4.667A4.67 4.67 0 0 0 12.667 8a4.67 4.67 0 0 0-4.667-4.667zm0 .333a1 1 0 0 1 1 1V7h2.333a1 1 0 1 1 0 2H9.001v2.333a1 1 0 1 1-2 0V9H4.667a1 1 0 1 1 0-2h2.333V4.666a1 1 0 0 1 1-1z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-minus-square">
<path d="M8 1.333a28.06 28.06 0 0 1 3.639.246c1.465.193 2.588 1.317 2.782 2.782.133 1.007.246 2.266.246 3.639s-.113 2.632-.246 3.639c-.193 1.465-1.317 2.588-2.782 2.782-1.007.133-2.266.246-3.639.246s-2.632-.113-3.639-.246c-1.465-.193-2.588-1.317-2.782-2.782A28.06 28.06 0 0 1 1.333 8a28.06 28.06 0 0 1 .246-3.639c.193-1.465 1.317-2.588 2.782-2.782A28.06 28.06 0 0 1 8 1.333zm2.667 6H5.333c-.368 0-.667.298-.667.667s.298.667.667.667h5.333c.368 0 .667-.298.667-.667s-.298-.667-.667-.667z"></path>
</symbol>
<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="icon-report">
<path d="M3.411 0c.368 0 .667.298.667.667v.666h7.768c1.097 0 1.707 1.239 1.089 2.103l-.077.098L10.744 6l2.113 2.466c.714.833.17 2.103-.888 2.196l-.124.005-7.768-.001v4.667c0 .335-.247.612-.568.659L3.411 16c-.368 0-.667-.298-.667-.667V.667c0-.335.247-.612.568-.659L3.411 0zm8.434 2.667H4.077v6.667h7.768L8.988 6l2.857-3.333z"></path>
</symbol>
</svg>
    </div>		
	</div>
  );
};

export default World;
