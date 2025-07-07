// utils/getStatusImage.ts
const images = [
  require("../assets/pontos/nenhum.png"),
  require("../assets/pontos/leve.png"),
  require("../assets/pontos/grave.png"),
  require("../assets/pontos/pendente.png"),
  require("../assets/pontos/concluido.png"),
  require("../assets/pontos/aberto.png"),
];

export function getStatusImage(status?: string) {
  switch (status?.toLowerCase()) {
    case "grave":
      return images[2];
    case "leve":
      return images[1];
    case "nenhum":
      return images[0];
    case "pendente":
      return images[3];
    case "concluído":
      return images[4];
    case "aberto":
      return images[5];
    default:
      return images[0];
  }
}
