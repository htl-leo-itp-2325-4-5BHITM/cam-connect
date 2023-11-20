import { Event, Model } from "Model/model"
import {store} from "../model/model"
import { produce } from "immer"

const URL = "http://localhost:8080/api/rent/getall"

async function loadEvents() {
    const response = await fetch(URL)
    const events: Event[] = await response.json()
    const model: Model = {
        events
    }
    const next = produce(store.getValue(), model => {
        model.events = events
    })
    store.next(next);
}
export { loadEvents }