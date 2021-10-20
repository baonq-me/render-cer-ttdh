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
    members.map((member) => {
        //console.log(">>>>>>>>", "Render file: ", member.filename, "[Start]");
        const start = Date.now();

        let file = imageString;
        for (let key in member) {
            file = file.replace(`{{{${key}}}}`, member[key]);
        }
        try {
            fs.writeFileSync(`output/${member.filename}.svg`, file);
            shell.echo(`./svg2pdf.sh output/${member.filename}.svg output/${member.filename}.pdf`).toEnd("myqueue");
        } catch (error) {
            renderErrors.push(member.filename);
            console.error(">>>>>>>>", "Render file: ",member.filename, "[Error]");
        }
    });
});
