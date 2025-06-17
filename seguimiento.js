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
      // Pedido válido
      agent.setContext({ name: 'estado_pedido', lifespan: 5 });
      agent.add("Perfecto. Estoy obteniendo el estado del pedido...");
      agent.add("¿El pedido fue entregado? (sí o no)");
    } else {
      // Pedido inválido
      agent.add("El número ingresado no es válido. Ingrese nuevamente el número de pedido.");
      agent.add('O escriba "ayuda" y te derivaré con un operador.');
    }
  }

  let intentMap = new Map();
  intentMap.set("ingresar_numero_pedido", verificarPedido);

  agent.handleRequest(intentMap);
});

app.listen(3000, () => console.log("Webhook escuchando en puerto 3000"));
