// import axios from "axios";

import buildClient from "../api/build-client";

const LandingPage = ({ currentuser }) => {
  //   console.log("I am in the compnent", currentuser);
  //   return <h1>Landing page</h1>;

  return currentuser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>Your are not signed in</h1>
  );
};

LandingPage.getInitialProps = async (context) => {
  //   if (typeof window === "undefined") {
  //     console.log("I am on the server!");

  //     //http://SERVICENAME.NAMESPACE.svc.cluster.local
  //     const { data } = await axios.get(
  //       "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
  //       {
  //         // headers: {
  //         //   Host: "ticketing.dev",
  //         // },
  //         headers: req.headers,
  //       }
  //     );

  //     return data;
  //   } else {
  //     console.log("I am on the browser!");

  //     const { data } = await axios.get("/api/users/currentuser");

  //     return data;
  //   }
  //   return {};

  const { data } = await buildClient(context).get("/api/users/currentuser");
  return data;
};

export default LandingPage;
