export default function ModuleList() {
    const modules = ["WAD", "OODD", "MAD", "Databases", "Intro to Networking"];
    
    const modulelist = modules.map((module) => 
    <li key={module}>{module}</li>);

    return <ul>{modulelist}</ul>
}