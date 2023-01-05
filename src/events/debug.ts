export default {
	name: 'debug',
	once: false,
	async execute(info: string) {
		console.debug(info);
	},
};