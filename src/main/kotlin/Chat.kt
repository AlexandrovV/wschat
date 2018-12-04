import org.jooby.WebSocket

interface Chat {
    fun createSender(): Sender
}

class PrivateChat (
        private val ws: WebSocket
) : Chat {
    override fun createSender(): Sender = PrivateSender(ws)
}

class PublicChat(
        private val ws: WebSocket
) : Chat{
    override fun createSender(): Sender = BroadcastSender(ws)
}