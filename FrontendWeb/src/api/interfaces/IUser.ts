
export interface IUser {
    id: string
    name: string
    phone: string
    email: string
    password: string
}

export enum Gender {
    Hombre = "HOMBRE",
    Mujer = "MUJER"
}

export type HelpedPerson = {
    name: string
    age: number 
    gender: Gender
    registerDate: Date 
}
