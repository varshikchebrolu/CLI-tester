import pathlib
import tempfile
from fastapi import FastAPI, Body, File, UploadFile,Query
from fastapi.middleware.cors import CORSMiddleware
from setup_assistant.cli import run
from typing import Optional  
from sse_starlette.sse import EventSourceResponse
import json
import asyncio
import threading

app = FastAPI(title="Setup Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/run")
async def run_steps(filePath: Optional[str] = Query(None), fileUrl: Optional[str] = Query(None)):

    async def event_generator():
        queue = asyncio.Queue()

        def send_event(event):
            queue.put_nowait(event)

        threading.Thread(target=lambda: run(path=filePath, url=fileUrl, send_event=send_event, fromFileAPI=True)).start()

        while True:
            event = await queue.get()
            if event is None:
                break
            yield f"{json.dumps(event)}\n\n"

    return EventSourceResponse(event_generator())



# @app.post("/upload")
# async def upload_file(file: UploadFile = File(...)):
#     try:
#         temp_path = pathlib.Path(tempfile.gettempdir()) / file.filename
#         with open(temp_path, "wb") as f:
#             f.write(await file.read())

#         print(f"Uploaded file saved at: {temp_path}")

#         result = run(path=str(temp_path), fromFileAPI=True)
#         return {"status": "success", "result": result}

#     except Exception as e:
#         print(f"Error during upload: {e}")
#         return {"status": "error", "message": str(e)}
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    temp_path = pathlib.Path(tempfile.gettempdir()) / file.filename
    with open(temp_path, "wb") as f:
        f.write(await file.read())
    print(f"Uploaded file saved at: {temp_path}")
    return {"status": "success", "filename": file.filename}


@app.get("/upload_stream")
async def upload_stream(filename: str = Query(...)):
    async def event_generator():
        queue = asyncio.Queue()

        def send_event(event):
            queue.put_nowait(event)

        file_path = pathlib.Path(tempfile.gettempdir()) / filename

        threading.Thread(target=lambda: run(path=str(file_path), send_event=send_event, fromFileAPI=True)).start()

        while True:
            event = await queue.get()
            if event is None:
                break
            yield f"{json.dumps(event)}\n\n"

    return EventSourceResponse(event_generator())
