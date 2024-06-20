import {Entity, PrimaryColumn, Column, BaseEntity, ManyToOne, JoinColumn} from 'typeorm';
import { Role } from './role';

// User table 

@Entity('user')
export class User extends BaseEntity {
    @PrimaryColumn()
    userId! : number;

    @Column({
        generated:'increment',
        type: 'int'
    })
    id!: number;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column({
        unique: true
    })
    email!:string;

    @Column({
        unique: true
    })
    username!: string;

    @Column()
    phone!: string;
    
    @Column()
    passwordHash!: string;
    
    @ManyToOne(() => Role)
    @JoinColumn({name:'roleId'})
    role!:Role

}
