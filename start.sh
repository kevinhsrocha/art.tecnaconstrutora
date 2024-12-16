#!/bin/bash
python -m waitress --host=0.0.0.0 --port=8080 backend.app:app
