import { LEMONIC_API } from "../constants";

export default async (id: string) => {
    return await fetch(`${LEMONIC_API}/api/raw/track/${id}`)
        .then((res) => res.json())
        .then((data) => data);
};
