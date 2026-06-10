import typer
from setup_assistant.core import SetupAssistant
from rich import print

app = typer.Typer()


@app.command()
def run(
    path: str = None,
    url: str = None,
    use_file_api: bool = False,
    fromFileAPI: bool = False,
    send_event=None,
):
    """
    Run setup assistant with either a local path or a URL and stream events.
    """
    assistant = SetupAssistant()
    steps = assistant.ask_ai_throughDocument(
        url=url, path=path, useFileAPI=use_file_api, send_event=send_event
    )

    results = assistant.run(steps, send_event=send_event)

    resultsPath = assistant.resultsSummaryFile(results, fromFileAPI=fromFileAPI)
    if send_event:
        send_event({"event": "done", "message": f"Results saved in {resultsPath}"})


if __name__ == "__main__":
    app()
