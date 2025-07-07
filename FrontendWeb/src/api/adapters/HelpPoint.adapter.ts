import { HelpPoint, HelpedPerson } from "../models/HelpPoint"

export type TPeopleHelpedBackend = {
    _id: string
    age: number
    gender: string
    name: string
}

export type THelpPointBackend = {
    _id: string
    route_id: string
    coords: number[]
    date_register: string
    people_helped: TPeopleHelpedBackend
    author_id: string
}

export type THelpPointCreateRequest = Omit<THelpPointBackend, '_id' | 'date_register'>
export type THelpPointUpdateRequest = THelpPointBackend

export function MapHelpedPersonFromBackend(data: Partial<TPeopleHelpedBackend>): HelpedPerson {
    const person: Partial<HelpedPerson> = {
        id: data._id,
        age: data.age,
        gender: data.gender,
        name: data.name
    };

    Object.entries(person).forEach(([key, value]) => {
        if (value === undefined) {
            throw new Error(`Missing required field in HelpedPerson: ${key}`)
        }
    })
    return person as HelpedPerson
}

export function MapHelpPointFromBackend(data: Partial<THelpPointBackend>): HelpPoint {
    const point: Partial<HelpPoint> = {
        id: data._id,
        routeID: data.route_id,
        authorID : data.author_id,
        coords: data.coords,
        dateRegister: data.date_register ? new Date(data.date_register) : undefined,
        peopleHelped: data.people_helped ? MapHelpedPersonFromBackend(data.people_helped) : undefined,
        disabled: false 
    }

    Object.entries(point).forEach(([key, value]) => {
        if (value === undefined) {
            throw new Error(`Missing required field in HelpPoint: ${key}`);
        }
    })
    return point as HelpPoint
}

export function MapHelpPointToCreateRequest(
    data: Omit<HelpPoint, 'id' | 'dateRegister'>
): THelpPointCreateRequest {
    return {
        route_id: data.routeID,
        coords: data.coords,
        people_helped: {
            _id: data.peopleHelped.id,
            age: data.peopleHelped.age,
            gender: data.peopleHelped.gender,
            name: data.peopleHelped.name
        },
        author_id: data.authorID, 
    }
}

export function MapHelpPointToUpdateRequest(
    data: HelpPoint
): THelpPointUpdateRequest {
    return {
        _id: data.id,
        route_id: data.routeID,
        coords: data.coords,
        date_register: data.dateRegister.toISOString(),
        people_helped: {
            _id: data.peopleHelped.id,
            age: data.peopleHelped.age,
            gender: data.peopleHelped.gender,
            name: data.peopleHelped.name
        },
        author_id: data.authorID, 
    }
}
