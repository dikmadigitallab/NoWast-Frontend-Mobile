interface UserData {
    id?: string | number;
    userType?: string;
    email?: string | null;
    document?: string | null;
    name?: string | null;
    position?: string | null;
    contractId?: string | number | null;
}

export default UserData;