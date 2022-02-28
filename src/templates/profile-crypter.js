import React from "react";
import { Helmet } from "react-helmet";
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import { StoreProvider } from "easy-peasy";
import store from "../store";
import Card from "./card-item";
import { useStoreState } from "easy-peasy";
import { BeatLoader } from "react-spinners";
import Icon from "@mdi/react";
import secrets from "../../secrets";
import { Spinner } from "@chakra-ui/spinner";
import Loader from "../cardano/loader";
import InfiniteGrid from "../components/InfiniteGrid";

const POLICY = "3c2cfd4f1ad33678039cfd0347cca8df363c710067d739624218abc0"; 

function fromHex(hex) {
  var str = "";
  for (var i = 0; i < hex.length && hex.substr(i, 2) !== "00"; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

const valueToAssets = (value) => {
  const assets = [];
  assets.push({ unit: "lovelace", quantity: value.coin().to_str() });
  if (value.multiasset()) {
    const multiAssets = value.multiasset().keys();
    for (let j = 0; j < multiAssets.len(); j++) {
      const policy = multiAssets.get(j);
      const policyAssets = value.multiasset().get(policy);
      const assetNames = policyAssets.keys();
      for (let k = 0; k < assetNames.len(); k++) {
        const policyAsset = assetNames.get(k);
        const quantity = policyAssets.get(policyAsset);
        const asset =
          Buffer.from(policy.to_bytes(), "hex").toString("hex") +
          Buffer.from(policyAsset.name(), "hex").toString("hex");
        assets.push({
          unit: asset,
          quantity: quantity.to_str(),
        });
      }
    }
  }
  return assets;
};

const Cards = (props) => {   
   let card_elems = [];   
   let start_index = 0;
   let end_index = props.filtered.length - 1;
   for (var i = start_index; i <= end_index; i++) {
	    let world_nft = props.filtered[i];
		if(world_nft) {
			if(world_nft.id) {
				card_elems.push(<Card world={world_nft} key={i} />);
			}
		}
   }       
   return(card_elems);
};

const Profile = (props) => {
  const spacebudz = props.spacebudz; 	
  
  const [address, setAddress] = React.useState("");
  const [tokens, setTokens] = React.useState({
    owned: [],
    bids: [],
    offers: [],
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const connected = useStoreState((state) => state.connection.connected);
  const didMount = React.useRef(false);
  const isFirstConnect = React.useRef(true);
  const fetchAddressBudz = async (address) => {
    setIsLoading(true);
    setTokens(null);
    const tokens = { owned: [], bids: [], offers: [] };
    let amount;

    const connectedAddresses = connected
      ? (await window.cardano.selectedWallet.getUsedAddresses()).map((addr) =>
          Loader.Cardano.Address.from_bytes(
            Buffer.from(addr, "hex")
          ).to_bech32()
        )
      : [];

    const isOwner = (address) =>
      connectedAddresses.length > 0
        ? connectedAddresses.some((addr) => addr === address)
        : false;

    if (connected === address) {
      await Loader.load();
      const value = Loader.Cardano.Value.from_bytes(
        Buffer.from(await window.cardano.selectedWallet.getBalance(), "hex")
      );

      amount = valueToAssets(value);
    } else {
      amount = await fetch(
        `https://cardano-mainnet.blockfrost.io/api/v0/addresses/${address}`, // TODO
        { headers: { project_id: secrets.PROJECT_ID } }
      )
        .then((res) => res.json())
        .then((res) => res.amount);
    }

    const offers = await fetch(`https://spacebudz.io/api/offers/`, { // TODO - either remove these, or replace the logic.
      headers: { project_id: secrets.PROJECT_ID },
    }).then((res) => res.json());

    const bids = await fetch(`https://spacebudz.io/api/bids`, {
      headers: { project_id: secrets.PROJECT_ID },
    }).then((res) => res.json());

    tokens.offers = offers.offers
      .filter(
        (offer) =>
          offer.offer.owner == address ||
          (connected === address && isOwner(offer.offer.owner))
      )
      .map((offer) => {
        const bidPrice = bids.bids.find((bid) => bid.budId == offer.budId);
        return {
          ...spacebudz[offer.budId],
          listingPrice: offer.offer.amount,
          bidPrice: bidPrice ? bidPrice.bid.amount : undefined,
        };
      });

    tokens.bids = bids.bids
      .filter(
        (bid) =>
          bid.bid.owner == address ||
          (connected === address && isOwner(bid.bid.owner))
      )
      .map((bid) => {
        const listingPrice = offers.offers.find(
          (offer) => offer.budId == bid.budId
        );
        return {
          ...spacebudz[bid.budId],
          bidPrice: bid.bid.amount,
          listingPrice: listingPrice ? listingPrice.offer.amount : undefined,
        };
      });

    try {
      const ownedAmount = amount
        .filter((am) => am.unit.startsWith(POLICY))
        .map((am) => parseInt(fromHex(am.unit.slice(56)).split("WorldsWithin")[1]));
      const owned = ownedAmount.map((id) => {
        const bidPrice = bids.bids.find((bid) => bid.budId == id);
        return {
          ...spacebudz[id],
          bidPrice: bidPrice ? bidPrice.bid.amount : undefined,
        };
      });
      tokens.owned = owned;
    } catch (e) {}
    setTokens(tokens);
    setIsLoading(false);
  };
  const update = async () => {
    const address =
      typeof window !== "undefined" &&
      new URL(window.location.href).searchParams.get("address");
    setAddress(address);
    fetchAddressBudz(address);
  };
  
  React.useEffect(() => { 
	const script = document.createElement("script");
	script.src = process.env.SITE_ROOT+"js/app.js";
	/* script.async = true;	*/
	document.body.appendChild(script);	
  }, []);
  
  React.useEffect(() => {
    if (didMount.current) {
      if (connected && !isFirstConnect.current)
        window.history.pushState({}, null, `/profile?address=${connected}`);
      else isFirstConnect.current = false;
    } else didMount.current = true;
    window.scrollTo(0, 0);
    update();
  }, [connected]);
  
  React.useEffect(() => {
    let url = window.location.href;
    const urlChange = setInterval(() => {
      const newUrl = window.location.href;
      if (url !== newUrl) {
        url = newUrl;
        update();
      }
    });
    return () => clearInterval(urlChange);
  }, []);
  
  
  
  return (
    <StoreProvider store={store}>		
		{/* Body */}
		<div className="outer__inner">
			<div className="profile">
			  <div className="profile__head js-profile-head" style={{backgroundImage: `url('${process.env.SITE_ROOT}img/content/bg-profile.jpg')`}}>
				<div className="profile__center center">
				  <div className="profile__file">
					<input type="file" />
					<div className="profile__wrap">
					  <svg className="icon icon-upload-file">
						<use xlinkHref="#icon-upload-file"></use>
					  </svg>
					  <div className="profile__info">Drag and drop your photo here</div>
					  <div className="profile__text">or click to browse</div>
					</div>
					<button className="button-small profile__button js-profile-save">Save photo</button>
				  </div>
				  {/*
				  <div className="profile__btns">
					<button className="button-stroke button-small profile__button js-profile-load"><span>Edit cover photo</span>
					  <svg className="icon icon-edit">
						<use xlinkHref="#icon-edit"></use>
					  </svg>
					</button><a className="button-stroke button-small profile__button" href="profile-edit.html"> <span>Edit profile</span>
					  <svg className="icon icon-image">
						<use xlinkHref="#icon-image"></use>
					  </svg></a>
				  </div>
				  */}
				</div>
			  </div>
			  <div className="profile__body">
				<div className="profile__center center">
				  <div className="user">
					<div className="user__avatar"><img src={process.env.SITE_ROOT+"img/icon-owner.png"} alt="Avatar"/></div>					
					<div className="user__code">
					  <div className="user__number" onClick={() =>
						window.open(`https://cardanoscan.io/address/${address}`)
					  } style={{cursor:'pointer'}}>{address}</div>
					  <button className="user__copy">
						<svg className="icon icon-copy">
						  <use xlinkHref="#icon-copy"></use>
						</svg>
					  </button>
					</div>					
				  </div>
				  <div className="profile__wrapper js-tabs">
					<div className="profile__nav">
						<a className="profile__link js-tabs-link active" href="#">Open Bids ({!isLoading ? tokens.bids.length : "..."})</a>
						<a className="profile__link js-tabs-link" href="#">Listed ({!isLoading ? tokens.offers.length : "..."})</a>
						<a className="profile__link js-tabs-link" href="#">Owned ({!isLoading ? tokens.owned.length + tokens.offers.length : "..."})</a></div>
					<div className="profile__container">
					  <div className="profile__item js-tabs-item" style={{ display: "block"}}>
						<div className="profile__list">
						  {isLoading 
						   ? <img src={process.env.SITE_ROOT+"img/loader.gif"} alt="Loader"/>
						   : <Cards filtered={tokens.bids} />
						  }
						</div>						
					  </div>
					  <div className="profile__item js-tabs-item">
						<div className="profile__list">
						  {isLoading 
						   ? <img src={process.env.SITE_ROOT+"img/loader.gif"} alt="Loader"/>
						   : <Cards filtered={tokens.offers} />
						  }
						</div>	
					  </div>
					  <div className="profile__item js-tabs-item">
						<div className="profile__list">
						  {isLoading 
						   ? <img src={process.env.SITE_ROOT+"img/loader.gif"} alt="Loader"/>
						   : <Cards filtered={tokens.owned} />
						  }
						</div>	
					  </div>					  			  
					</div>
				  </div>
				</div>
			  </div>
			</div>
		</div>		
	</StoreProvider>
  );
};

export default Profile;
