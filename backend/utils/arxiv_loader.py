# # utils/arxiv_loader.py
# import os
# import tarfile
# import requests
# import shutil
# import re
# import tempfile
# from urllib.parse import urlparse

# def is_url(string):
#     return string.startswith("http://") or string.startswith("https://")

# def download_arxiv_source(url, save_path):
#     """
#     Downloads the source tarball from an ArXiv URL.
#     Converts /abs/ links to /e-print/ links automatically.
#     """
#     # Convert 'abs' URL to 'e-print' URL (source)
#     if "/abs/" in url:
#         url = url.replace("/abs/", "/e-print/")
    
#     print(f"⬇️ Downloading source from {url}...")
#     headers = {'User-Agent': 'Mozilla/5.0'}
#     response = requests.get(url, headers=headers, stream=True)
#     response.raise_for_status()
    
#     with open(save_path, 'wb') as f:
#         for chunk in response.iter_content(chunk_size=8192):
#             f.write(chunk)
#     return save_path

# def find_main_tex_file(directory):
#     """
#     Heuristic to find the main .tex file:
#     1. Looks for a file with \documentclass
#     2. Prioritizes files named 'main.tex' or 'ms.tex'
#     """
#     tex_files = []
#     for root, dirs, files in os.walk(directory):
#         for file in files:
#             if file.endswith(".tex"):
#                 tex_files.append(os.path.join(root, file))

#     if not tex_files:
#         raise FileNotFoundError("No .tex files found in the archive.")

#     # Check for \documentclass
#     for path in tex_files:
#         with open(path, 'r', encoding='utf-8', errors='ignore') as f:
#             content = f.read()
#             if r"\documentclass" in content:
#                 return path

#     return tex_files[0] # Fallback to first found

# def flatten_tex(main_file_path):
#     """
#     Reads the main .tex file and recursively replaces \input{...} 
#     with the actual content of the referenced files.
#     """
#     base_dir = os.path.dirname(main_file_path)
    
#     with open(main_file_path, 'r', encoding='utf-8', errors='ignore') as f:
#         content = f.read()

#     # Regex to find \input{filename} or \include{filename}
#     # Captures: \input{filename}
#     input_pattern = re.compile(r'\\(?:input|include)\{([^}]+)\}')

#     def replace_match(match):
#         filename = match.group(1)
#         if not filename.endswith('.tex'):
#             filename += '.tex'
        
#         full_path = os.path.join(base_dir, filename)
        
#         if os.path.exists(full_path):
#             # Recursively flatten the included file
#             return flatten_tex(full_path)
#         else:
#             # If file not found, keep the command (or comment it out)
#             print(f"⚠️ Warning: Could not find included file {filename}")
#             return f"% MISSING FILE: {filename}\n"

#     # Replace all occurrences
#     flattened_content = input_pattern.sub(replace_match, content)
#     return flattened_content

# def load_tex_from_source(input_source):
#     """
#     Main entry point.
#     input_source: Can be an ArXiv URL or a local .tar path.
#     Returns: The full flattened LaTeX string.
#     """
#     temp_dir = tempfile.mkdtemp()
#     tar_path = ""

#     try:
#         # 1. Handle Input Type
#         if is_url(input_source):
#             tar_path = os.path.join(temp_dir, "source.tar")
#             download_arxiv_source(input_source, tar_path)
#         else:
#             if not os.path.exists(input_source):
#                 raise FileNotFoundError(f"File not found: {input_source}")
#             tar_path = input_source

#         # 2. Extract
#         extract_path = os.path.join(temp_dir, "extracted")
#         os.makedirs(extract_path, exist_ok=True)
        
#         try:
#             with tarfile.open(tar_path, "r:*") as tar:
#                 tar.extractall(path=extract_path)
#         except tarfile.ReadError:
#             # Handle case where it might be a single .tex file downloaded directly
#             pass

#         # 3. Find Main File
#         main_file = find_main_tex_file(extract_path)
#         print(f"📄 Found main file: {os.path.basename(main_file)}")

#         # 4. Flatten content
#         full_content = flatten_tex(main_file)
#         return full_content

#     finally:
#         # Cleanup temp directory
#         shutil.rmtree(temp_dir, ignore_errors=True)






# utils/arxiv_loader.py
import os
import tarfile
import requests
import shutil
import re
import tempfile

def is_url(string):
    return string.startswith("http://") or string.startswith("https://")

def download_arxiv_source(url, save_path):
    """
    Downloads the source tarball from an ArXiv URL.
    Converts /abs/ links to /e-print/ links automatically.
    """
    # Convert 'abs' URL to 'e-print' URL (source)
    if "/abs/" in url:
        url = url.replace("/abs/", "/e-print/")
    
    print(f"⬇️ Downloading source from {url}...")
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(url, headers=headers, stream=True)
    response.raise_for_status()
    
    with open(save_path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
    return save_path

def find_main_tex_file(directory):
    r"""
    Heuristic to find the main .tex file:
    1. Looks for a file with \documentclass
    2. Prioritizes files named 'main.tex' or 'ms.tex'
    """
    tex_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".tex"):
                tex_files.append(os.path.join(root, file))

    if not tex_files:
        raise FileNotFoundError("No .tex files found in the archive.")

    # Check for \documentclass
    for path in tex_files:
        with open(path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            if r"\documentclass" in content:
                return path

    return tex_files[0] # Fallback to first found

def flatten_tex(main_file_path):
    r"""
    Reads the main .tex file and recursively replaces \input{...} 
    with the actual content of the referenced files.
    """
    base_dir = os.path.dirname(main_file_path)
    
    with open(main_file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Regex to find \input{filename} or \include{filename}
    input_pattern = re.compile(r'\\(?:input|include)\{([^}]+)\}')

    def replace_match(match):
        filename = match.group(1)
        if not filename.endswith('.tex'):
            filename += '.tex'
        
        full_path = os.path.join(base_dir, filename)
        
        if os.path.exists(full_path):
            return flatten_tex(full_path)
        else:
            print(f"⚠️ Warning: Could not find included file {filename}")
            return f"% MISSING FILE: {filename}\n"

    # Replace all occurrences
    flattened_content = input_pattern.sub(replace_match, content)
    return flattened_content

def load_tex_from_source(input_source):
    """
    Main entry point.
    input_source: Can be an ArXiv URL or a local .tar path.
    Returns: The full flattened LaTeX string.
    """
    temp_dir = tempfile.mkdtemp()
    tar_path = ""

    try:
        # 1. Handle Input Type
        if is_url(input_source):
            tar_path = os.path.join(temp_dir, "source.tar")
            download_arxiv_source(input_source, tar_path)
        else:
            if not os.path.exists(input_source):
                raise FileNotFoundError(f"File not found: {input_source}")
            tar_path = input_source

        # 2. Extract
        extract_path = os.path.join(temp_dir, "extracted")
        os.makedirs(extract_path, exist_ok=True)
        
        try:
            with tarfile.open(tar_path, "r:*") as tar:
                tar.extractall(path=extract_path)
        except tarfile.ReadError:
            print("⚠️ Warning: File might not be a standard tarball.")
            pass

        # 3. Find Main File
        main_file = find_main_tex_file(extract_path)
        print(f"📄 Found main file: {os.path.basename(main_file)}")

        # 4. Flatten content
        full_content = flatten_tex(main_file)
        return full_content

    finally:
        # Cleanup temp directory (only if we downloaded it)
        if is_url(input_source):
            shutil.rmtree(temp_dir, ignore_errors=True)