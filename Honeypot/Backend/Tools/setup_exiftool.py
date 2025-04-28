import os
import platform
import stat

def make_exiftool_executable():
    system = platform.system()
    tool_dir = os.path.dirname(__file__)
    
    if system == "Windows":
        exe_path = os.path.join(tool_dir, "exiftool.exe")
        if not os.path.exists(exe_path):
            print("❌ exiftool.exe not found. Please add it to tools folder.")
        else:
            print("✅ exiftool.exe is ready.")
    else:
        exe_path = os.path.join(tool_dir, "exiftool")
        if not os.path.exists(exe_path):
            print("❌ exiftool binary not found. Please add it to tools folder.")
        else:
            # Make it executable
            st = os.stat(exe_path)
            os.chmod(exe_path, st.st_mode | stat.S_IEXEC)
            print("✅ exiftool is now executable.")

if __name__ == "__main__":
    make_exiftool_executable()
