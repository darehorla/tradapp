import axios from "axios";

const Axios = axios.create({
  baseURL: "https://api.tradewithowkaz.com",
});

export default Axios;
