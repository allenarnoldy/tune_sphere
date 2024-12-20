export interface TicketMasterData {
    name: string | null;
    url: string | null;
    sales:{
        public:{
            startDateTime: string | null;
            endDateTime: string | null;
        }        
    }
}
