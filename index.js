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
        console.log(">>>>>>>>", "Render file: ", member.filename, "[Start]");
        let file = imageString;
        for (let key in member) {
            file = file.replace(`{{{${key}}}}`, member[key]);
        }
        try {
            fs.writeFileSync(`output/${member.filename}.svg`, file);
            shell.exec(`./svg2pdf.sh output/${member.filename}.svg output/${member.filename}.pdf `);
            shell.exec(`rm output/${member.filename}.svg`);

            console.log(">>>>>>>>", "Render file: ", member.filename, "[Success]");
        } catch (error) {
            renderErrors.push(member.filename);
            console.error(">>>>>>>>", "Render file: ", member.filename, "[Error]");
        }
    });
    console.log("Render success: ", members.length - renderErrors.length);
    console.log("Render error: ", renderErrors.length);
    console.error(renderErrors);
});
