const express = require("express");
const app = express();
const fetch = require("isomorphic-unfetch");
const PORT = 4000;

const getOngkirCheck = async (request, response) => {
  try {
    fetch("https://api.rajaongkir.com/starter/cost", {
      method: "POST",
      headers: {
        key: "84bd7061ceff95c1279aaa87099a5ea7",
        Accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        origin: request.body.origin,
        destination: request.body.destination,
        weight: request.body.weight,
        courier: request.body.courier
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('data:', data.rajaongkir);
        return response.status(200).send({ data: data });
      });
  } catch (error) {
    console.log(error);
  }
};

app.post("/api/cek_ongkir", getOngkirCheck);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
