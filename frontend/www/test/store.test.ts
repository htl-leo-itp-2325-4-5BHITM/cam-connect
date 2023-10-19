import { suite, test } from '@testdeck/mocha'
import store, { setUsers } from "../src/model/store"
import { User } from "../src/model/user"
import * as chai from "chai"
import { map } from 'rxjs'

@suite
export class StoreTest {
    private users: User[]

    before() {
        this.users = [{id: 1, name: "John Doe"}]
    }
    @test 'given store when subscribed it should deliver empty model'() {
        store.subscribe(model => {
            chai.expect(model.users.length == 0)
        })
    }
    @test 'given empty store when setting John Doe store should call subscribe function twice whith 2nd as John Doe'() {
        let actualResponses = Array<User[]>()
        store
            .pipe(
                map(model => model.users)
            )
            .subscribe(users => {
                actualResponses.push(users)
            })
        setUsers(this.users)
        chai.expect(actualResponses).to.have.lengthOf(2)
        chai.expect(actualResponses[0]).to.have.lengthOf(0)
        chai.expect(actualResponses[1][0].name).to.equal("John Doe")
    }
}

