# Mass certificates rendering

This program generates PDF files by combining data from a CSV file and an SVG design file.

## 1. Input data

Firstly, look at `input` folder. There are two files:
- `image.svg` - Certificate design in svg format
- `members.csv` - Data to be generated

Secondly, install fonts inside folder `fonts` if `image.svg` is using them.

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

Push command into pipe `myqueue` by running Nodejs program.

```bash
node index.js
```

When pipelining command into `myqueue`, your CPU load should be increased.

## 4. Complete

Currently, there is no way to known exactly that whenever the rendering task is finished then monitoring CPU load is the only acceptable solution.

Output pdf files are placed in `output` folder.

Remember to stop thread pool by this command

```bash
bash pool.sh stop
```