export default function formatDate(dateString: string) {
    const months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const [year, month, day] = dateString?.split('-');

    const formattedDate = `${parseInt(day)} de ${months[parseInt(month) - 1]} de ${year}`;

    return formattedDate;
}
