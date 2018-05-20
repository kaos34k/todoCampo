export class Message{
	constructor(
			public _id:string,
			public text: string,
			public create_at : string,
			public view:string,
			public emitter: string,
			public receiver: string,

		){
		
	}
}