import { createInvitation } from "./actions";
export default function Page({searchParams}:{searchParams:Promise<{token?:string}>}){return searchParams.then(q=><main><h1>Undangan Prospect</h1><form action={createInvitation}><input name="email" type="email" required/><button>Tambah undangan</button></form>{q.token&&<p>Salin sekali: <code>{`/invite/accept?token=${q.token}`}</code></p>}</main>)}
