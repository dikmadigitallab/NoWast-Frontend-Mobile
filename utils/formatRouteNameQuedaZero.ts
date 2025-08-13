export function formatRouteNameQuedaZero(path: string) {
    switch (path) {
        case "/detalharOcorrencia":
            return "Detalhar Ocorrência";
        case "/ocorrencias":
        case "/":
            return "Dashboard";
        case "/selecionar-stack":
            return "Queda Zero";
        case "/mapa":
            return "Mapa";
        case "perfil":
            return "Perfil";
        case "/main":
            return "Queda Zero";
        case "/criarOcorrencia":
            return "Nova Ocorrência";
        case "/detalharAtividade":
            return "Detalhar Atividade";
        case "/cronograma":
            return "Cronograma";
        case "/checklist":
            return "Checklist";
        case "/notificacoes":
            return "Notificação";
        default:
            return path;
    }
}