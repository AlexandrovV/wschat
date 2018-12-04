import com.google.gson.Gson
import org.jooby.WebSocket

interface Sender {
    fun send(message: Message)
}

class PrivateSender(
        private val ws: WebSocket
) : Sender {
    private val gson = Gson()
    override fun send(message: Message) {
        ws.broadcast(gson.toJson(message))
    }
}

class BroadcastSender(
        private val ws: WebSocket
) : Sender {
    private val gson = Gson()
    override fun send(message: Message) {
        ws.broadcast(gson.toJson(message))
    }
}