export default {
	name: 'error',
	once: false,
	async execute(error: Error) {
		console.error(error);
	},
};