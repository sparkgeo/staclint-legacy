// Legacy function that was not implemented. Hiding here, as getting versions is something we eventually want to do
import { getJSON } from 'jquery';

const getStacVersions = () =>
  getJSON('https://api.github.com/repos/radiantearth/stac-spec/tags');

export default getStacVersions;
