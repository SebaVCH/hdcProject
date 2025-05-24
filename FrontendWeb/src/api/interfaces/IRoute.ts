import { HelpedPerson } from "./IUser"

export interface IRoute {
    id: string
    description: string
    routeLeader: string 
    team: [string]
    helpPoints: [HelpPoint]
    status: string 
    createdAt: Date 
    alert: Alert
}

export interface Alert {
    id: string
    routeId: string 
    type: string 
    description: string 
    createdAt: Date
}


export interface HelpPoint {
    id: string
    coords: CoordDD
    dateRegister: Date
    peopleHelped: HelpedPerson[]
    lastTimeVisited: Date
}

export type CoordDD = {
    X: number
    Y: number
}


export interface Risk {
    _id ?: string
    coords : number[]
    createdAt : string 
    description : string
}