<?php

namespace App\DataFixtures;

use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {

        $faker  = Factory::create('fr_FR');
        $chrono = 1;

        $benjamin = new User();
        $benjamin->setFirstName("Benjamin")
                 ->setLastName("Girard")
                 ->setEmail("benjamin@girard.com")
                 ->setPassword("password");

        $manager->persist($benjamin);

        for ($u=0; $u < 10; $u++) { 
            $user = new User();
            $user->setFirstName($faker->firstName())
                 ->setLastName($faker->lastName)
                 ->setEmail($faker->email)
                 ->setPassword("password");

            $manager->persist($user);
        }

        for($c=0 ; $c<30 ; $c++){

            $customer = new Customer(); 
            $customer->setFirstName($faker->firstName())
                     ->setLastName($faker->lastName)
                     ->setCompany($faker->company)
                     ->setEmail($faker->email);
            
            $manager->persist($customer);

            for ($i=0; $i < mt_rand(3, 20) ; $i++) { 

                $invoice = new Invoice(); 
                $invoice->setAmout($faker->randomFloat(2, 250, 5000))
                        ->setSentAt($faker->dateTimeBetween('-6 months'))
                        ->setStatus($faker->randomElement(['SENT', 'PAID', 'CANCELLED']))
                        ->setChrono($chrono)
                        ->setCustomer($customer); 

                $chrono++;

                $manager->persist($invoice);
            }
        }

        $manager->flush();
    }
}
