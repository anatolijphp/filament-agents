// The composer on a page of the app's own (a dashboard, a home page), outside the chat page's agentChat scope
// (agent-chat.js): the bindings the markup reads, and Send hands the text to the host Livewire component's method
// (`<x-packstub-agents::composer standalone method="ask" />` calls `$wire.ask(text)`). Enter sends, Shift+Enter
// breaks the line, Esc clears; files drop, paste or attach when the host renders the paper clip. No queue, no
// stream, no record picker and no drafts: those are the chat page's. The field is cleared once the host's method
// has returned, so a question the host refused stays in the box.
export default function agentComposer({ method = 'send' } = {}) {
    return {
        busy: false,
        editing: false,
        stopping: false,
        turn: null,
        dragging: false,
        mentions: [],
        picker: { open: false, kind: null, query: '', items: [], index: 0, start: 0, loading: false, timer: null },

        init() {
            this.autosize()
        },

        async submit() {
            const text = this.$refs.input.value.trim()
            const files = this.$refs.files ? this.$refs.files.files.length : 0
            if (text === '' && files === 0) return
            await this.$wire[method](text)
            this.$refs.input.value = ''
            this.autosize()
        },

        typed() {},

        recall() {},

        closePicker() {},

        pick() {},

        stop() {},

        cancelEdit() {
            this.$refs.input.value = ''
            this.autosize()
        },

        autosize() {
            const input = this.$refs.input
            input.style.height = 'auto'
            input.style.height = Math.min(input.scrollHeight, 192) + 'px'
        },

        // Files dropped on the composer or pasted into it join the picked ones (Livewire uploads them on change).
        dropFiles(event) {
            this.addFiles(event.dataTransfer?.files)
        },

        pasteFiles(event) {
            const files = [...(event.clipboardData?.files ?? [])]
            if (files.length === 0) return
            event.preventDefault()
            this.addFiles(files)
        },

        addFiles(files) {
            const input = this.$refs.files
            if (! input || ! files || files.length === 0) return
            const transfer = new DataTransfer()
            for (const file of input.files) transfer.items.add(file)
            for (const file of files) transfer.items.add(file)
            input.files = transfer.files
            input.dispatchEvent(new Event('change', { bubbles: true }))
        },
    }
}
