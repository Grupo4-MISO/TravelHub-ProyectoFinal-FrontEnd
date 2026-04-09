export class user {
    email: string;
    password: string;
    role: string;
    username: string;

    public constructor(email: string, password:string, role: string, username: string) {
        this.email = email
        this.password = password
        this.role = role
        this.username = username
    }
}