/** UNUSED
 * for unit tests we must define the environment for browsers,
 * otherwise we get problems with immer in the current version.
 * 
 */
window.process = {
	env: {
		NODE_ENV: "development"
	}
}