#!/bin/bash
python -m waitress --host=0.0.0.0 --port=10000 backend.app:app
