
import UsersStore.seq
import com.google.gson.Gson
import org.jooby.Kooby
import org.jooby.run

class App : Kooby({
    port(8080)
    assets("/", "index.html")
    assets("client.js", "client.js")
    assets("style.css", "style.css")

    ws("/chat") { ws ->
        val gson = Gson()

        ws.send(gson.toJson(Message("users", UsersStore.users)))
        // connected
        ws.onMessage { m ->

            val message = gson.fromJson<Message>(m.value(), Message::class.java)

            when(message.type) {
                "join" -> {
                    println("${message.data} joined")
                    val user = User(seq++, message.data as String)
                    UsersStore.users.add(user)
                    ws.broadcast(gson.toJson(Message("join", user)))
                }
                "message" -> {
                    val chat = PublicChat(ws)
                    val sender = chat.createSender()
                    sender.send(message)
                }
                "privateMessage" -> {
                    val chat = PrivateChat(ws)
                    val sender = chat.createSender()
                    sender.send(message)
                }
                "leave" -> {
                    val user = UsersStore.users.first { it.name.equals(message.data) }
                    UsersStore.users.remove(user)
                    ws.broadcast(gson.toJson(Message("left", user)))
                }
            }
        }
    }.produces("json")
})

fun main(args: Array<String>) {
    run(::App, *args)
}