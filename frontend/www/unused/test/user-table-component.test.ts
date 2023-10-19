import { html, fixture, expect } from '@open-wc/testing'
import { UserTableComponent } from '../../src/components/user/user-table-component'
import { setUsers } from '../../src/model/store';
import { User } from '../../src/model/user'

const users: User[] = [{id: 1, name: "John Doe"}]

describe('UserTableComponent', () => {
    before(function() {
        setUsers(users)
    })
  
    it('given user-table when setting users then has John Doe', async () => {
        const el: UserTableComponent = await fixture(html`<user-table></user-table>`)
        const cl = el.shadowRoot!.querySelector("table").getAttribute("class")
        //TODO: continue here, currently it is not possible for me to interact with custom element.
        console.log(cl)
        console.log("el is: ", el)
      })
});
