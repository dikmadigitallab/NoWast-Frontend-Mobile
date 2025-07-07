export function formatRouteNameResiduo(path: string) {
    switch (path) {
        case "/detalharOcorrencia":
            return "Detalhar Ocorrência";
        case "/ocorrencias":
        case "/":
            return "Gestão de Resíduos";
        case "/selecionar-stack":
            return "Gestão de Resíduos";
        case "/mapa":
            return "Mapa";
        case "perfil":
            return "Perfil";
        case "/dashboard":
            return "Dashboard";
        case "/criarOcorrencia":
            return "Nova Ocorrência";
        case "/detalharAtividade":
            return "Detalhar Atividade";
        case "/cronograma":
            return "Cronograma";
        case "/checklist":
            return "Checklist";
        default:
            return path;
    }
}