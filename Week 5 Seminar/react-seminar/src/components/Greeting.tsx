type GreetingProps = {
    firstname: string;
    lastname: string;
    age: number;
    colour: string
};

export default function Greeting({firstname, lastname, age, colour}: GreetingProps) {
    return (
    <div style={{backgroundColor: colour, padding: '10px', marginBottom: '10px'}}>
    <p>Hello {firstname} {lastname}, your age is {age}</p>
    <p>{age>=18 ? 'You are an adult' : 'You are not an adult'}</p>
    </div>
    );
}