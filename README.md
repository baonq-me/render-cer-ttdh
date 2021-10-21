# Mass certificates rendering

This program generates PDF files by combining data from a CSV file and an SVG design file using Google Chrome as rendering engine.

Tested on Macbook Pro M1 running macOS Big Sur 11.6 show that the program can render 4800 PDF files in approximately 16 minutes with 100% CPU load (25% CPU time is wasted for system, 100% fan speed, max temp is 82oC at normal room condition). Memory consumption is quite low and not noticeable. 

## 1. Input data

Firstly, look at `input` folder. There are two sample files:
- `image.svg` - Certificate design in svg format
- `members.csv` - Data to be generated

If the designer gave you an `UTF-16` SVG file, use this command to convert to `UTF-8` SVG file which is supported by this program ([read more](https://www.tecmint.com/convert-files-to-utf-8-encoding-in-linux))

```bash
iconv -f UTF-16 -t UTF-8 image-utf16-input.svg > image-utf8-output.svg
```

Secondly, install fonts inside folder `fonts` if your SVG file is using them.

## 2. Start thread pool

Firstly, edit parameter `WORKERS` inside `pool.sh` to choose thread pool size.

Secondly, run command

```bash
chmod +x pool.sh
chmod +x worker
bash pool.sh start
```

After thread pool is started, a pipe named `myqueue` is created in the same folder.

## 3. Start rendering 

*Due to lacking off working time, I have to use this way to fully utilized CPU power. During my test on Macbook Pro M1 running macOS Big Sur 11.6 , 25% CPU time is wasted for `system`*

Push command into pipe `myqueue` by running Nodejs program.

```bash
node index.js
```

When pipelining command into `myqueue`, your CPU load should be increased.

## 4. Complete

Currently, there is no way to known exactly that whenever the rendering task is finished then monitoring CPU load is the only acceptable solution.

Output pdf files are placed in `output` folder. List of file name in order with `members.csv` is put in `list_file.txt`.

Remember to stop thread pool by this command

```bash
bash pool.sh stop
```