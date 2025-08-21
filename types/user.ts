interface UserData {
    id?: string | number;
    userType?: string;
    email?: string | null;
    document?: string | null;
    name?: string | null;
    position?: string | null;
    contractId?: string | number | null;
}


export const userTypes: { [key: string]: string } = {
    DEFAULT: '',
    ADM_DIKMA: 'Administrador Dikma',
    DIKMA_ADMINISTRATOR: 'Administrador Dikma',
    GESTAO: 'Gestão',
    ADM_CLIENTE: 'Administrador(a) Cliente Dikma',
    DIKMA_DIRECTOR: 'Diretoria Dikma',
    OPERATIONAL: 'Operacional'
}

export default UserData;