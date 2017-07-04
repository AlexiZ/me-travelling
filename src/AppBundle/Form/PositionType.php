<?php

namespace AppBundle\Form;

use AppBundle\Entity\File;
use AppBundle\Entity\Position;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PositionType extends AbstractType
{
    /**
     * @inheritDoc
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add(
                'title',
                TextType::class,
                [
                    'label' => 'position.form.title',
                    'attr' => [
                        'placeholder' => 'position.form.title'
                    ],
                    'required' => true
                ]
            )
            ->add(
                'description',
                TextareaType::class,
                [
                    'label' => 'position.form.description',
                    'attr' => [
                        'placeholder' => 'position.form.description'
                    ],
                    'required' => false
                ]
            )
            ->add(
                'image',
                FileType::class,
                [
                    'label' => 'position.form.image',
                    'required' => false,
                    'mapped' => false
                ]
            )
            ->add(
                'latitude',
                TextType::class,
                [
                    'label' => 'position.form.latitude',
                    'attr' => [
                        'placeholder' => 'position.form.latitude'
                    ],
                    'required' => true
                ]
            )
            ->add(
                'longitude',
                TextType::class,
                [
                    'label' => 'position.form.longitude',
                    'attr' => [
                        'placeholder' => 'position.form.longitude'
                    ],
                    'required' => true
                ]
            )
        ;

        $builder->addEventListener(FormEvents::SUBMIT, function(FormEvent $event) use ($options) {
            $form = $event->getForm();
            $position = $event->getData();

            $uploadedFile = $form->get('image')->getData();
            if ($uploadedFile) {
                // Generate a unique name for the file before saving it
                $fileName = md5(uniqid()) . '.' . $uploadedFile->guessExtension();

                // Move the file to the directory where brochures are stored
                $uploadedFile->move(
                    $options['imagesDirectory'],
                    $fileName
                );

                $image = new File();
                $image->setName($uploadedFile->getClientOriginalName());
                $image->setPath($fileName);

                $position->setImage($image);
            }
        });
    }

    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Position::class,
            'imagesDirectory' => null
        ]);
    }
}