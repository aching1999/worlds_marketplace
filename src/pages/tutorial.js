import React from "react";

import Metadata from "../components/Metadata";
import { useBreakpoint } from "gatsby-plugin-breakpoints";
import { Box, Link, Grid, GridItem } from "@chakra-ui/layout";

const Tutorial = (props) => {
  const matches = useBreakpoint();

  return (
    <>
      <Metadata
        titleTwitter="WorldsWithin FAQ"
        title="WorldsWithin"
        description="VR Cardano NFTs."
      />
    </>
  );
};

export default Tutorial;
