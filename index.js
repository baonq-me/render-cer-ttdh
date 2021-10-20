const fs = require("fs");
const csv = require("csvtojson");
const shell = require('shelljs')

if (!fs.existsSync("./output")) {
    console.log(">>>>>>>>>", "Create folder output");
    fs.mkdirSync("./output");
}

fs.readdir("./input", (err, filenames) => {
    filenames.forEach((file) => {
        if (file === "image.svg" || file === "members.csv") return;
        fs.copyFile(`./input/${file}`, `./output/${file}`, function (err) {
            if (err) console.error(">>>>>", `./input/${file}`);
        });
    });
});

const getMembersObject = (callback) => {
    csv({ trim: true, delimiter: "," }).fromFile("./input/members.csv").then(callback);
};

console.log(">>>>>>>>>", "Read image file");
const imageString = fs.readFileSync("./input/image.svg", { encoding: "utf-8" });
getMembersObject((members) => {
    let renderErrors = [];
    members.map((member) => {
        //console.log(">>>>>>>>", "Render file: ", member.filename, "[Start]");
        const start = Date.now();

        let file = imageString;
        for (let key in member) {
            file = file.replace(`{{{${key}}}}`, member[key]);
        }
        try {
            fs.writeFileSync(`output/${member.filename}.svg`, file);
            if (shell.exec(`./svg2pdf.sh output/${member.filename}.svg output/${member.filename}.pdf &> /dev/null`).code === 0)
            {
                const stop = Date.now()
                console.log(`>>>>>>>> Render file: [${(stop - start)} ms] ${member.filename} [Success]`);
            } else {
                console.error(">>>>>>>>", "Render file: ",member.filename, "[Error]");
            }
            shell.rm(`output/${member.filename}.svg`);

        } catch (error) {
            renderErrors.push(member.filename);
            console.error(">>>>>>>>", "Render file: ",member.filename, "[Error]");
        }
    });
    console.log("Total success: ", members.length - renderErrors.length);
    console.log("Total error: ", renderErrors.length);
    console.error(renderErrors);
});
