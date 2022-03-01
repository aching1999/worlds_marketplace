import React from "react";

import Metadata from "../components/Metadata";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Text,
  Link,
} from "@chakra-ui/react";

//assets
import { Box } from "@chakra-ui/layout";

const FAQ = () => {
  return (
    <>
      <Metadata
        titleTwitter="WorldsWithin FAQ"
        title="WorldsWithin"
        description="VR Cardano NFTs."
      />
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Box h="200px" />
        <div
          style={{
            fontSize: 32,
            fontWeight: "bold",
          }}
        >
          FAQ
        </div>
        <Box h={10} />
        <div style={{ width: "90%", maxWidth: 900 }}>
          <Accordion allowMultiple>
          <h3>
                  What is the Worlds Within Marketplace?
              </h3>
              <Text fontSize="sm">
                  The Worlds Within Marketplace is the home for all Worlds Within NFTs for users to purchase. Overtime we will expand it to all Worlds Within related avatars and airdrops. We hope to collaborate with the community to curate the marketplace into becoming the leader in 3D assets for gaming based Metaverses on Cardano. This means assets for avatars, assets for customizing avatars and digital architecture.
              </Text>
              <br></br>
              <h3>
                  Can I view the worlds through the Marketplace?
              </h3>
              <Text fontSize="sm">
                  Yes! If you click on "View Virtual World" you can view your Worlds Within NFT before buying!
              </Text>
              <br></br>
              <h3>
                  What are the fees involved?
              </h3>
              <Text fontSize="sm">
                  Transaction fee when you list (2.5 ADA) 
                  This is the price you pay to list a Worlds Within NFT.
              </Text>
              <br></br>
              <h3>
                  What Wallets are supported?
              </h3>
              <Text fontSize="sm">
                  We currently support Nami wallet and CCVault for all buying and selling.
              </Text>
          </Accordion>
        </div>
      </div>
    </>
  );
};

export default FAQ;
