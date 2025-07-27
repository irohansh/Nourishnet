import os

def copy_code_to_document(root_directory, output_path):
    # If output_path is a directory, append a default filename
    if os.path.isdir(output_path):
        output_path = os.path.join(output_path, "combined_code.txt")
    
    with open(output_path, 'w', encoding='utf-8') as out:
        # Walk through the directory tree
        for dirpath, dirnames, filenames in os.walk(root_directory):
            for file in filenames:
                # Check for file types .js and .json
                if file.endswith('.html') or file.endswith('.js') or file.endswith('.css'):
                    file_path = os.path.join(dirpath, file)
                    # Write a heading with the file path for clarity
                    out.write("\n" + "="*50 + "\n")
                    out.write(f"File: {file_path}\n")
                    out.write("="*50 + "\n\n")
                    try:
                        # Read and write the file content
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                            out.write(content)
                            out.write("\n")
                    except Exception as e:
                        out.write(f"Error reading file: {e}\n")

if __name__ == '__main__':
    # Input the root directory of your downloaded repository and the desired output file or directory
    root_directory = input("Enter the directory path: ").strip()
    output_path = input("Enter the output file path or directory: ").strip()
    copy_code_to_document(root_directory, output_path)
    print(f"Code has been successfully copied to {output_path}")
