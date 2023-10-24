import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

/**
 * @typedef User
 * @type {object}
 *
 * Direct properties from the cmp api response:
 * @property {boolean} cmpAdmin
 * @property {boolean} globalViewer
 * @property {string} username
 * @property {string} email
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} id
 * @property {string} globalId
 * @property {string} source
 */

export const useUserStore = defineStore(
  'user',
  () => {
    /** @type {boolean} */
    const cmpAdmin = ref(false)

    /** @type {boolean} */
    const globalViewer = ref(false)

    /** @type {string} */
    const username = ref('')

    /** @type {string} */
    const email = ref('')

    /** @type {string} */
    const firstName = ref('')

    /** @type {string} */
    const lastName = ref('')

    /** @type {string} */
    const id = ref('')

    /** @type {string} */
    const globalId = ref('')

    /** @type {string} */
    const source = ref(null)

    /** @param {User} newUser */
    function setCurrentUser(newUser = {}) {
      this.$patch({
        // CMP's api <2022.3.2 used to return the property "cmpAdmin". Now it's "superAdmin"
        cmpAdmin: newUser.superAdmin ?? newUser.cmpAdmin,
        globalViewer: newUser.globalViewer,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        id: newUser.id,
        globalId: newUser.globalId,
        source: newUser.source
      })
    }

    /** @type {User} */
    const user = computed(() => ({
      cmpAdmin: cmpAdmin.value,
      globalViewer: globalViewer.value,
      username: username.value,
      email: email.value,
      firstName: firstName.value,
      lastName: lastName.value,
      id: id.value,
      globalId: globalId.value,
      source: source.value
    }))

    /** @type {boolean} */
    const isAdmin = computed(() => cmpAdmin.value)

    /** @type {boolean} */
    const isGlobalViewer = computed(() => globalViewer.value)

    /** @type {boolean} */
    const isAdminOrGlobalViewer = computed(
      () => isAdmin.value || isGlobalViewer.value
    )

    /** @type {boolean} */
    const isLdapUser = computed(() => source.value !== null)

    return {
      cmpAdmin,
      globalViewer,
      username,
      email,
      firstName,
      lastName,
      id,
      globalId,
      source,
      setCurrentUser,
      user,
      isAdmin,
      isGlobalViewer,
      isAdminOrGlobalViewer,
      isLdapUser
    }
  },
  {
    persist: false
  }
)
