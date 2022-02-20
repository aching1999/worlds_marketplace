const metadata = require("./metadata.json"); // TODO - We can replace this with koios calls.
const initialOrder = require("./order.json"); // 

const getSpacebudz = () => { // TODO we actually don't want to use koios, it's too much let's try and keep things as similar as we can to as they are.
  return Object.keys(metadata).map((id) => {
    const type = metadata[id].type;
    const gadgets = metadata[id].traits;
	const src = metadata[id].src;
	const world_type = metadata[id]["World Type"];
	const terrain_trait = metadata[id]["Terrain Trait"];
	const terrain_color = metadata[id]["Terrain Color"];
	const year_length = metadata[id]["Year Length"];
    const image =
      "https://ipfs.blockfrost.dev/ipfs/" +
      metadata[id].image.split("ipfs://")[1];
    return {
      id,
      image,
      type,
      gadgets,
	  src,
	  world_type,
	  terrain_trait,
	  terrain_color,
	  year_length
    };
  });
};

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  actions.setWebpackConfig({
    experiments: {
      asyncWebAssembly: true,
    },
  });
};

exports.createPages = async ({ actions: { createPage } }) => {
  const spacebudz = getSpacebudz();
  createPage({
    path: `/explore/`,
    component: require.resolve("./src/templates/explore-crypter.js"),
    context: { spacebudz, initialOrder },
  });
  spacebudz.forEach((spacebud) => {
    createPage({
      path: `/explore/world/${spacebud.id}/`,
      component: require.resolve("./src/templates/world.js"),
      context: { spacebud },
    });
  });
  createPage({
    path: `/profile`,
    component: require.resolve("./src/templates/profile.js"),
    context: { spacebudz },
  });
  createPage({
    path: `/`,
    component: require.resolve("./src/templates/crypter.js"),
    context: { spacebudz, initialOrder },
  });
};
