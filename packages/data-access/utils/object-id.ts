import { ObjectId } from "bson";

export function generateObjectId() {
    return new ObjectId();
}

export function toObjectId(value: string) {
    return new ObjectId(value);
}
