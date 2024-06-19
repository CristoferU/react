import axios from "axios";

export const getImages = async (searchTerm = "technology") =>
  await axios.get(`https://api.pexels.com/v1/search?query=${searchTerm}`, {
    headers: {
      Authorization: "u6NwPafU95CCd7u91p2IL66VQTNOjsj7gdtSsSSEOekFwMJAQTCPeMcZ"
    },
  });
