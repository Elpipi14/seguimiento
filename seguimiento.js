const express = require("express");
const bodyParser = require("body-parser");
const { WebhookClient } = require("dialogflow-fulfillment");

const app = express();
app.use(bodyParser.json());

app.post("/webhook", (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  function verificarPedido(agent) {
    const numero = agent.parameters.numeroPedido;

    if (numero % 2 === 0) {
      agent.setContext({ name: 'estado_pedido', lifespan: 5 });
      agent.add("Perfecto. Estoy obteniendo el estado del pedido...");
    } else {
      agent.end("El número ingresado no es válido. Te derivaré con un operador humano.");
    }
  }

  let intentMap = new Map();
  intentMap.set("ingresar_numero_pedido", verificarPedido);

  agent.handleRequest(intentMap);
});

app.listen(3000, () => console.log("Webhook escuchando en puerto 3000"));
